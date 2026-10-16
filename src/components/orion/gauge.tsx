const ARC_START = 150;
const ARC = 240;
const R = 78;

function pt(deg: number, radius = R) {
  const a = (deg * Math.PI) / 180;
  return { x: 120 + radius * Math.cos(a), y: 120 + radius * Math.sin(a) };
}

export function Gauge({
  percent,
  caption,
  color,
}: {
  percent: number;
  caption: string;
  color: "gold" | "up" | "down" | "muted";
}) {
  const pct = Math.max(0, Math.min(100, percent));
  const angle = ARC_START + (pct / 100) * ARC;
  const tip = pt(angle, 62);
  const tone =
    color === "up" ? "text-up" : color === "down" ? "text-down" : color === "gold" ? "text-gold" : "text-faint";
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const deg = ARC_START + (i / 20) * ARC;
    const outer = pt(deg, 90);
    const inner = pt(deg, i % 5 === 0 ? 80 : 84);
    const on = i / 20 <= pct / 100 + 0.001;
    return { i, outer, inner, on, major: i % 5 === 0 };
  });

  return (
    <div className={`relative mx-auto w-44 ${tone}`}>
      <svg viewBox="0 0 240 210" className="w-full">
        <circle cx="120" cy="120" r="100" className="fill-bg" opacity="0.55" />
        {ticks.map((tick) => (
          <line
            key={tick.i}
            x1={tick.inner.x}
            y1={tick.inner.y}
            x2={tick.outer.x}
            y2={tick.outer.y}
            stroke="currentColor"
            strokeOpacity={tick.on ? 0.95 : 0.2}
            strokeWidth={tick.major ? 2.4 : 1.3}
            strokeLinecap="round"
          />
        ))}
        <line x1="120" y1="120" x2={tip.x} y2={tip.y} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="120" cy="120" r="5" fill="currentColor" />
      </svg>
      <div className="absolute inset-x-0 top-[58%] text-center">
        <div className="font-display text-4xl leading-none font-semibold tabular-nums">{Math.round(pct)}</div>
        <div className="mt-1 text-xs tracking-widest text-muted uppercase">{caption}</div>
      </div>
    </div>
  );
}
