import { useState } from "react";
import { mmss, px, signedBrl } from "@/lib/format";
import { useDesk, type Source } from "@/lib/desk";
import { useMarketVersion } from "@/lib/market";

const FILTERS: Array<{ id: "todas" | Source; label: string }> = [
  { id: "todas", label: "Todas" },
  { id: "manual", label: "Manuais" },
  { id: "bot", label: "Robô" },
  { id: "copy", label: "Copy" },
];

export function Ops() {
  useMarketVersion();
  const openTrades = useDesk((s) => s.openTrades);
  const history = useDesk((s) => s.history);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("todas");
  const match = (source: Source) => filter === "todas" || source === filter;
  const open = openTrades.filter((trade) => match(trade.source));
  const closed = history.filter((trade) => match(trade.source));

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-auto p-3">
      <header>
        <h1 className="font-display text-3xl font-semibold">Operações</h1>
        <p className="text-sm text-muted">Abertas e encerradas nesta sessão de simulação.</p>
      </header>
      <div className="flex gap-2 overflow-x-auto">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={
              filter === item.id
                ? "h-10 shrink-0 rounded-full bg-fg px-4 text-sm font-medium text-bg"
                : "h-10 shrink-0 rounded-full border border-line px-4 text-sm text-muted"
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      <section className="rounded-lg border border-line bg-panel p-3">
        <h2 className="font-display text-lg font-semibold">Em aberto</h2>
        {open.length === 0 && <p className="mt-2 text-sm text-muted">Nenhuma operação aberta neste filtro.</p>}
        <ul className="mt-2 flex flex-col gap-2">
          {open.map((trade) => (
            <li key={trade.id} className="flex items-center justify-between gap-3 text-sm">
              <span>
                <b className={trade.side === "call" ? "text-up" : "text-down"}>{trade.side === "call" ? "Alta" : "Baixa"}</b>{" "}
                {trade.symbol}
                <span className="text-muted"> · {label(trade.source)}</span>
              </span>
              <span className="font-display text-base tabular-nums">{mmss(trade.openAt + trade.expiryMs - Date.now())}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-lg border border-line bg-panel p-3">
        <h2 className="font-display text-lg font-semibold">Histórico</h2>
        {closed.length === 0 && <p className="mt-2 text-sm text-muted">Quando uma ordem expirar, ela aparece aqui.</p>}
        <ul className="mt-2 flex flex-col">
          {closed.map((trade) => (
            <li key={trade.id} className="flex items-center justify-between gap-3 border-b border-line py-3 text-sm last:border-0">
              <div>
                <div>
                  {trade.symbol}{" "}
                  <span className={trade.side === "call" ? "text-up" : "text-down"}>
                    {trade.side === "call" ? "alta" : "baixa"}
                  </span>
                </div>
                <div className="text-muted">
                  {label(trade.source)} · {px(trade.openPrice, trade.digits)} → {px(trade.closePrice, trade.digits)}
                </div>
              </div>
              <div className={trade.pnl > 0 ? "font-display text-lg text-up" : trade.pnl < 0 ? "font-display text-lg text-down" : "font-display text-lg text-muted"}>
                {signedBrl(trade.pnl)}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function label(source: Source) {
  if (source === "bot") return "Robô";
  if (source === "copy") return "Copy";
  return "Manual";
}
