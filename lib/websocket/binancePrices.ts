import type {
  BinancePriceState,
  BinancePriceSubscription,
} from "@/type/binancePrices";

export function subscribeBinancePrices({
  baseURL,
  symbols,
  onState,
}: BinancePriceSubscription): () => void {
  let socket: WebSocket | undefined;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  let attempts = 0;
  let state: BinancePriceState = { status: "disconnected", prices: {} };
  const selectedSymbols = new Set(symbols.map((symbol) => symbol.toUpperCase()));

  const publishStatus = (status: BinancePriceState["status"]) => {
    state = { ...state, status };
    onState(state);
  };

  if (symbols.length === 0 || !baseURL) {
    onState(state);
    return () => {};
  }

  const url = new URL("/stream", baseURL);
  if (url.protocol !== "wss:") {
    throw new Error("The Binance WebSocket URL must use wss://.");
  }
  url.searchParams.set(
    "streams",
    [...selectedSymbols].map((symbol) => `${symbol.toLowerCase()}@miniTicker`).join("/"),
  );

  function reconnect() {
    if (stopped) return;
    publishStatus("reconnecting");
    const delay = Math.min(1_000 * 2 ** Math.min(attempts++, 5), 30_000);
    retryTimer = setTimeout(connect, delay);
  }

  function connect() {
    if (stopped) return;
    retryTimer = undefined;
    publishStatus(attempts > 0 ? "reconnecting" : "connecting");

    try {
      socket = new WebSocket(url.toString());
    } catch {
      reconnect();
      return;
    }

    const current = socket;
    current.onopen = () => {
      if (!stopped) publishStatus("connected");
    };
    current.onmessage = (event: MessageEvent) => {
      if (stopped || typeof event.data !== "string") return;

      let message: unknown;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      if (typeof message !== "object" || message === null || !("data" in message)) return;
      const data = message.data;
      if (typeof data !== "object" || data === null || !("e" in data)) return;
      if (data.e === "serverShutdown") {
        // Reconnect through onclose; also handles Binance's 24-hour disconnect.
        current.close();
        return;
      }
      if (
        data.e !== "24hrMiniTicker" ||
        !("s" in data) || typeof data.s !== "string" ||
        !selectedSymbols.has(data.s) ||
        !("c" in data) || typeof data.c !== "string" ||
        data.c.trim() === "" || !Number.isFinite(Number(data.c)) ||
        !("E" in data) || typeof data.E !== "number" || !Number.isFinite(data.E)
      ) return;

      attempts = 0;
      state = {
        status: "connected",
        prices: {
          ...state.prices,
          [data.s]: { symbol: data.s, price: data.c, eventTime: data.E },
        },
      };
      onState(state);
    };
    current.onerror = () => current.close();
    current.onclose = reconnect;
  }

  connect();

  return () => {
    stopped = true;
    clearTimeout(retryTimer);
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      socket.close();
    }
  };
}
