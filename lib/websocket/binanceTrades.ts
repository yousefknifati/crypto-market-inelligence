import type {
  BinanceCombinedTradeMessage,
  BinanceTradePayload,
  BinanceTradeStreamState,
  BinanceTradeStreamSubscription,
} from "@/type/binanceTrade";

function isBinanceTradePayload(value: unknown): value is BinanceTradePayload {
  if (typeof value !== "object" || value === null) return false;

  const payload = value as Partial<BinanceTradePayload>;
  return payload.e === "trade"
    && typeof payload.E === "number"
    && Number.isFinite(payload.E)
    && typeof payload.s === "string"
    && typeof payload.t === "number"
    && Number.isFinite(payload.t)
    && typeof payload.p === "string"
    && payload.p.trim() !== ""
    && Number.isFinite(Number(payload.p))
    && typeof payload.q === "string"
    && payload.q.trim() !== ""
    && Number.isFinite(Number(payload.q))
    && typeof payload.T === "number"
    && Number.isFinite(payload.T)
    && typeof payload.m === "boolean"
    && typeof payload.M === "boolean";
}

function parseBinanceTradeMessage(value: unknown): BinanceCombinedTradeMessage | null {
  if (typeof value !== "object" || value === null) return null;

  const message = value as Partial<BinanceCombinedTradeMessage>;
  if (typeof message.stream !== "string" || !isBinanceTradePayload(message.data)) {
    return null;
  }

  return { stream: message.stream, data: message.data };
}

export function subscribeBinanceTrades({
  onState,
  symbols,
  url,
}: BinanceTradeStreamSubscription): () => void {
  let socket: WebSocket | undefined;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let emptyTimer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  let attempts = 0;
  let state: BinanceTradeStreamState = {
    error: null,
    hasTimedOut: false,
    status: "disconnected",
    trades: {},
  };
  const selectedSymbols = new Set(
    symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean),
  );

  const publish = (nextState: Partial<BinanceTradeStreamState>) => {
    state = { ...state, ...nextState };
    onState(state);
  };

  if (selectedSymbols.size === 0) {
    publish({ error: "No live market symbols were selected." });
    return () => {};
  }

  let streamUrl: URL;
  try {
    streamUrl = new URL(url);
  } catch {
    publish({ error: "The Binance live stream URL is invalid." });
    return () => {};
  }

  if (streamUrl.protocol !== "wss:") {
    publish({ error: "The Binance live stream must use a secure WebSocket." });
    return () => {};
  }

  const reconnect = () => {
    if (stopped) return;

    clearTimeout(emptyTimer);
    if (attempts >= 6) {
      publish({
        error: "The live price stream could not reconnect. Try again manually.",
        status: "disconnected",
      });
      return;
    }

    publish({ status: "reconnecting" });
    const delay = Math.min(1_000 * 2 ** Math.min(attempts, 5), 30_000);
    attempts += 1;
    reconnectTimer = setTimeout(connect, delay);
  };

  function connect() {
    if (stopped) return;

    clearTimeout(reconnectTimer);
    publish({
      error: null,
      hasTimedOut: false,
      status: attempts > 0 ? "reconnecting" : "connecting",
    });

    try {
      socket = new WebSocket(streamUrl.toString());
    } catch {
      publish({ error: "The live price stream could not be opened." });
      reconnect();
      return;
    }

    const currentSocket = socket;
    currentSocket.onopen = () => {
      if (stopped) return;

      attempts = 0;
      publish({ error: null, status: "connected" });
      emptyTimer = setTimeout(() => {
        if (Object.keys(state.trades).length === 0) {
          publish({ hasTimedOut: true });
        }
      }, 8_000);
    };

    currentSocket.onmessage = (event: MessageEvent) => {
      if (stopped || typeof event.data !== "string") return;

      let parsedValue: unknown;
      try {
        parsedValue = JSON.parse(event.data);
      } catch {
        return;
      }

      const message = parseBinanceTradeMessage(parsedValue);
      if (!message || !selectedSymbols.has(message.data.s)) return;

      const price = Number(message.data.p);
      const quantity = Number(message.data.q);
      const previousPrice = state.trades[message.data.s]?.price;
      const priceChangePercent = previousPrice && previousPrice !== 0
        ? ((price - previousPrice) / previousPrice) * 100
        : null;

      clearTimeout(emptyTimer);
      publish({
        error: null,
        hasTimedOut: false,
        status: "connected",
        trades: {
          ...state.trades,
          [message.data.s]: {
            eventTime: message.data.E,
            price,
            priceChangePercent,
            quantity,
            receivedAt: Date.now(),
            side: message.data.m ? "sell" : "buy",
            symbol: message.data.s,
            tradeId: message.data.t,
          },
        },
      });
    };

    currentSocket.onerror = () => {
      if (!stopped) {
        publish({ error: "The Binance live stream connection was interrupted." });
      }
      currentSocket.close();
    };
    currentSocket.onclose = reconnect;
  }

  connect();

  return () => {
    stopped = true;
    clearTimeout(emptyTimer);
    clearTimeout(reconnectTimer);
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      socket.close();
    }
  };
}
