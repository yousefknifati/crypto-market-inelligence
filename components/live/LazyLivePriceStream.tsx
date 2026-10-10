"use client";

import dynamic from "next/dynamic";
import LivePriceStreamSkeleton from "@/components/live/LivePriceStreamSkeleton";

const LivePriceStream = dynamic(
  () => import("@/components/live/LivePriceStream"),
  {
    ssr: false,
    loading: () => <LivePriceStreamSkeleton />,
  },
);

export default function LazyLivePriceStream() {
  return <LivePriceStream />;
}
