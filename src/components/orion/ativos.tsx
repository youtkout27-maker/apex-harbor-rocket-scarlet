import { useState } from "react";
import { pct, px } from "@/lib/format";
import { market, useMarketVersion, type Kind } from "@/lib/market";
import { useDesk } from "@/lib/desk";

const KINDS: Array<Kind | "Todos"> = ["Todos", "Forex", "Cripto", "Índice", "Commodity", "Ação"];

export function Ativos() {
  useMarketVersion();
  const assetId = useDesk((s) => s.assetId);
  const setAsset = useDesk((s) => s.setAsset);
  const setView = useDesk((s) => s.setView);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Todos");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const rows = market.list().filter((item) => {
    if (kind !== "Todos" && item.def.kind !== kind) return false;
    if (!query) return true;
    return (
      item.def.symbol.toLowerCase().includes(query) ||
      item.def.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-auto p-3">
      <header>
        <h1 className="font-display text-3xl font-semibold">Ativos</h1>
        <p className="text-sm text-muted">Preços gerados neste aparelho. Nenhum feed de corretora.</p>
      </header>
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Buscar par ou nome"
        className="h-12 rounded-md border border-line bg-panel px-3 text-fg outline-none placeholder:text-faint focus:border-gold"
      />
      <div className="flex gap-2 overflow-x-auto">
        {KINDS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setKind(item)}
            className={
              kind === item
                ? "h-10 shrink-0 rounded-full bg-fg px-4 text-sm font-medium text-bg"
                : "h-10 shrink-0 rounded-full border border-line px-4 text-sm text-muted"
            }
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {rows.map((item) => {
          const delta = item.dayOpen ? ((item.price - item.dayOpen) / item.dayOpen) * 100 : 0;
          const on = item.def.id === assetId;
          return (
            <li key={item.def.id}>
              <button
                type="button"
                onClick={() => {
                  setAsset(item.def.id);
                  setView("sala");
                }}
                className={
                  on
                    ? "flex w-full items-center gap-3 rounded-lg border border-gold bg-panel px-3 py-3 text-left"
                    : "flex w-full items-center gap-3 rounded-lg border border-line bg-panel px-3 py-3 text-left"
                }
              >
                <div className="min-w-0 flex-1">
                  <div className="font-display text-xl leading-none font-semibold">{item.def.symbol}</div>
                  <div className="truncate text-sm text-muted">
                    {item.def.name} · {item.def.kind}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-semibold tabular-nums">{px(item.price, item.def.digits)}</div>
                  <div className={delta >= 0 ? "text-sm text-up" : "text-sm text-down"}>{pct(delta)}</div>
                </div>
                <div className="w-14 text-right text-sm text-gold">{Math.round(item.def.payout * 100)}%</div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
