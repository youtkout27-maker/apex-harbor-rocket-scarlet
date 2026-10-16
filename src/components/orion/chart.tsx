import { useEffect, useRef, useState } from "react";
import { market, useMarketVersion } from "@/lib/market";
import { px } from "@/lib/format";
import type { OpenTrade } from "@/lib/desk";

export function PriceChart({ assetId, trades }: { assetId: string; trades: OpenTrade[] }) {
  useMarketVersion();
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const measure = () => setSize({ w: node.clientWidth, h: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const live = market.get(assetId);
  const candles = market.candles(assetId);
  const ready = market.booted && candles.length > 2 && size.w > 40 && size.h > 40;

  const padL = 8;
  const padR = 74;
  const padT = 14;
  const padB = 16;
  let min = Infinity;
  let max = -Infinity;
  if (ready) {
    for (const candle of candles) {
      min = Math.min(min, candle.l);
      max = Math.max(max, candle.h);
    }
    const span = Math.max(max - min, live.price * 0.0008);
    min -= span * 0.12;
    max += span * 0.12;
  }
  const plotW = Math.max(1, size.w - padL - padR);
  const plotH = Math.max(1, size.h - padT - padB);
  const yOf = (value: number) => padT + ((max - value) / (max - min || 1)) * plotH;
  const slot = plotW / Math.max(1, candles.length);
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const rising = last && prev ? last.c >= prev.c : true;
  const guides = [0, 1, 2, 3].map((i) => max - ((max - min) * i) / 3);

  return (
    <div ref={box} className="relative h-full min-h-56 w-full bg-panel">
      {!ready && (
        <p className="absolute top-4 left-4 text-sm text-muted">Preparando a série sintética…</p>
      )}
      {ready && last && (
        <svg width={size.w} height={size.h} className="block" role="img" aria-label={`Gráfico ${live.def.symbol}`}>
          {guides.map((value) => (
            <g key={value}>
              <line
                x1={padL}
                x2={size.w - padR + 4}
                y1={yOf(value)}
                y2={yOf(value)}
                className="stroke-line"
                strokeWidth="1"
              />
              <text
                x={size.w - padR + 8}
                y={yOf(value) + 4}
                className="fill-muted font-display text-xs"
              >
                {px(value, live.def.digits)}
              </text>
            </g>
          ))}
          {candles.map((candle, index) => {
            const x = padL + index * slot + slot / 2;
            const bull = candle.c >= candle.o;
            const body = Math.max(2.5, slot * 0.62);
            const top = yOf(Math.max(candle.o, candle.c));
            const bot = yOf(Math.min(candle.o, candle.c));
            return (
              <g key={candle.t} className={bull ? "stroke-up fill-up" : "stroke-down fill-down"}>
                <line x1={x} x2={x} y1={yOf(candle.h)} y2={yOf(candle.l)} strokeWidth="1.4" />
                <rect x={x - body / 2} y={top} width={body} height={Math.max(1.5, bot - top)} />
              </g>
            );
          })}
          <line
            x1={padL}
            x2={size.w - padR + 4}
            y1={yOf(last.c)}
            y2={yOf(last.c)}
            className={rising ? "stroke-up" : "stroke-down"}
            strokeDasharray="4 4"
          />
          {trades
            .filter((trade) => trade.assetId === assetId)
            .map((trade) => (
              <line
                key={trade.id}
                x1={padL}
                x2={size.w - padR}
                y1={yOf(trade.openPrice)}
                y2={yOf(trade.openPrice)}
                className={trade.side === "call" ? "stroke-gold" : "stroke-down"}
                strokeWidth="1.2"
              />
            ))}
          <rect
            x={size.w - padR + 6}
            y={yOf(last.c) - 11}
            width="66"
            height="22"
            rx="4"
            className={rising ? "fill-up" : "fill-down"}
          />
          <text
            x={size.w - padR + 12}
            y={yOf(last.c) + 5}
            className={`font-display text-sm font-bold ${rising ? "fill-ink" : "fill-fg"}`}
          >
            {px(last.c, live.def.digits)}
          </text>
        </svg>
      )}
    </div>
  );
}
