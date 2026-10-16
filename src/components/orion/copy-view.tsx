import { signedBrl } from "@/lib/format";
import { market, useMarketVersion } from "@/lib/market";
import { useDesk } from "@/lib/desk";
import { TRADERS, traderById } from "@/lib/traders";

export function CopyView() {
  useMarketVersion();
  const following = useDesk((s) => s.following);
  const setFollowing = useDesk((s) => s.setFollowing);
  const copyStake = useDesk((s) => s.copyStake);
  const setCopyStake = useDesk((s) => s.setCopyStake);
  const history = useDesk((s) => s.history);
  const alias = useDesk((s) => (s.hideName ? "Anônimo" : s.alias || "Visitante"));
  const active = traderById(following ?? undefined);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-auto p-3">
      <header>
        <h1 className="font-display text-3xl font-semibold">Copy</h1>
        <p className="text-sm text-muted">
          {alias} segue um estilo no livro sintético. O valor sai da conta virtual aberta.
        </p>
      </header>
      <label className="rounded-lg border border-line bg-panel p-3 text-sm text-muted">
        Valor por sinal
        <input
          data-testid="copy-stake"
          type="number"
          min={5}
          value={copyStake || ""}
          onChange={(event) => setCopyStake(Number(event.target.value))}
          className="mt-2 h-12 w-full rounded-md border border-line bg-bg px-3 font-display text-2xl font-semibold text-fg outline-none focus:border-gold"
        />
        <span className="mt-2 block">Expiração dos sinais copiados: 20 segundos. {active ? `Seguindo ${active.name}.` : "Ninguém em cópia."}</span>
      </label>
      <ul className="grid gap-2 md:grid-cols-2">
        {TRADERS.map((trader) => {
          const mine = history.filter((row) => row.traderId === trader.id);
          const pnl = mine.reduce((sum, row) => sum + row.pnl, 0);
          const wins = mine.filter((row) => row.result === "win").length;
          const on = following === trader.id;
          return (
            <li key={trader.id} className="rounded-lg border border-line bg-panel p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-2xl leading-none font-semibold">{trader.name}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {trader.styleLabel} · {trader.market}
                  </p>
                </div>
                <span className="rounded-full border border-line px-2 py-1 text-xs text-muted">{trader.risk}</span>
              </div>
              <p className="mt-3 font-display text-lg">
                Sessão {mine.length === 0 ? "sem operações" : `${wins}/${mine.length} · ${signedBrl(pnl)}`}
              </p>
              <button
                type="button"
                data-testid={`follow-${trader.id}`}
                onClick={() => setFollowing(on ? null : trader.id)}
                className={
                  on
                    ? "mt-3 h-11 w-full rounded-md bg-down font-display text-lg font-bold text-fg"
                    : "mt-3 h-11 w-full rounded-md bg-up font-display text-lg font-bold text-ink"
                }
              >
                {on ? "PARAR CÓPIA" : "COPIAR"}
              </button>
            </li>
          );
        })}
      </ul>
      <section className="rounded-lg border border-line bg-panel p-3">
        <h2 className="font-display text-lg font-semibold">Sinais da sala</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {market.signals.length === 0 && <li className="text-sm text-muted">Os sinais aparecem conforme o livro anda.</li>}
          {market.signals.slice(0, 8).map((signal) => {
            const trader = traderById(signal.traderId);
            const asset = market.get(signal.assetId).def;
            return (
              <li key={signal.id} className="flex items-center justify-between text-sm">
                <span>{trader?.name}</span>
                <span className={signal.side === "call" ? "text-up" : "text-down"}>
                  {asset.symbol} {signal.side === "call" ? "alta" : "baixa"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
