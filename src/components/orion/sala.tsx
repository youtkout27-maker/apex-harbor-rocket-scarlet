import { PriceChart } from "@/components/orion/chart";
import { Gauge } from "@/components/orion/gauge";
import { brl, mmss, pct, px, signedBrl } from "@/lib/format";
import { market, useMarketVersion } from "@/lib/market";
import { EXPIRIES, goalAmount, useDesk, type Side } from "@/lib/desk";

const EXPIRY_LABEL: Record<number, string> = {
  15000: "15s",
  30000: "30s",
  60000: "1m",
  300000: "5m",
};

export function Sala() {
  const version = useMarketVersion();
  const assetId = useDesk((s) => s.assetId);
  const setAsset = useDesk((s) => s.setAsset);
  const stake = useDesk((s) => s.stake);
  const setStake = useDesk((s) => s.setStake);
  const expiryMs = useDesk((s) => s.expiryMs);
  const setExpiry = useDesk((s) => s.setExpiry);
  const manual = useDesk((s) => s.manual);
  const openTrades = useDesk((s) => s.openTrades);
  const live = market.get(assetId);
  const change = live.dayOpen ? ((live.price - live.dayOpen) / live.dayOpen) * 100 : 0;
  void version;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-auto p-3 xl:flex-row xl:overflow-hidden">
      <section className="flex min-h-80 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-panel xl:min-h-0">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-3 py-3">
          <div>
            <div className="text-xs tracking-widest text-muted uppercase">{live.def.kind}</div>
            <h1 className="font-display text-2xl leading-none font-semibold">{live.def.symbol}</h1>
            <p className="text-sm text-muted">{live.def.name}</p>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl leading-none font-semibold tabular-nums" data-testid="price">
              {px(live.price, live.def.digits)}
            </div>
            <div className={change >= 0 ? "text-sm text-up" : "text-sm text-down"}>{pct(change)}</div>
          </div>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-line px-3 py-2">
          {market.list().map((item) => {
            const on = item.def.id === assetId;
            const delta = item.dayOpen ? ((item.price - item.dayOpen) / item.dayOpen) * 100 : 0;
            return (
              <button
                key={item.def.id}
                type="button"
                onClick={() => setAsset(item.def.id)}
                className={
                  on
                    ? "shrink-0 rounded-md border border-gold bg-gold-dim px-3 py-2 text-left"
                    : "shrink-0 rounded-md border border-line bg-panel-2 px-3 py-2 text-left"
                }
              >
                <div className="font-display text-sm leading-none font-semibold">{item.def.symbol}</div>
                <div className={delta >= 0 ? "text-xs text-up" : "text-xs text-down"}>{pct(delta, 2)}</div>
              </button>
            );
          })}
        </div>
        <div className="min-h-56 flex-1">
          <PriceChart assetId={assetId} trades={openTrades} />
        </div>
      </section>

      <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-96 xl:overflow-auto">
        <Ticket
          stake={stake}
          setStake={setStake}
          expiryMs={expiryMs}
          setExpiry={setExpiry}
          payout={live.def.payout}
          onSide={manual}
          openTrades={openTrades.filter((t) => t.source === "manual" || t.assetId === assetId)}
        />
        <BotPanel />
      </aside>
    </div>
  );
}

function Ticket({
  stake,
  setStake,
  expiryMs,
  setExpiry,
  payout,
  onSide,
  openTrades,
}: {
  stake: number;
  setStake: (n: number) => void;
  expiryMs: number;
  setExpiry: (ms: number) => void;
  payout: number;
  onSide: (side: Side) => void;
  openTrades: ReturnType<typeof useDesk.getState>["openTrades"];
}) {
  useMarketVersion();
  const profit = stake * payout;
  return (
    <section className="rounded-lg border border-line bg-panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-wide">ORDEM</h2>
        <span className="text-xs text-muted">Pagamento {Math.round(payout * 100)}%</span>
      </div>
      <label className="mb-2 block text-xs tracking-widest text-muted uppercase" htmlFor="stake">
        Valor virtual
      </label>
      <input
        id="stake"
        data-testid="stake"
        inputMode="decimal"
        type="number"
        min={5}
        step={5}
        value={stake || ""}
        onChange={(event) => setStake(Number(event.target.value))}
        className="mb-3 h-12 w-full rounded-md border border-line bg-bg px-3 font-display text-2xl font-semibold text-fg outline-none focus:border-up"
      />
      <div className="mb-3 grid grid-cols-4 gap-2">
        {EXPIRIES.map((ms) => (
          <button
            key={ms}
            type="button"
            onClick={() => setExpiry(ms)}
            className={
              expiryMs === ms
                ? "h-11 rounded-md bg-fg font-display text-base font-bold text-bg"
                : "h-11 rounded-md border border-line font-display text-base font-semibold text-muted"
            }
          >
            {EXPIRY_LABEL[ms]}
          </button>
        ))}
      </div>
      <p className="mb-3 text-sm text-muted">
        Se acertar, {signedBrl(profit)}. Abaixo de 100% de pagamento, a expectativa no longo prazo é negativa.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          data-testid="call"
          onClick={() => onSide("call")}
          className="h-12 rounded-md bg-up font-display text-xl font-bold tracking-wide text-ink"
        >
          ALTA
        </button>
        <button
          type="button"
          data-testid="put"
          onClick={() => onSide("put")}
          className="h-12 rounded-md bg-down font-display text-xl font-bold tracking-wide text-fg"
        >
          BAIXA
        </button>
      </div>
      {openTrades.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {openTrades.slice(0, 4).map((trade) => {
            const left = trade.openAt + trade.expiryMs - Date.now();
            return (
              <li key={trade.id} className="flex items-center justify-between rounded-md bg-panel-2 px-3 py-2 text-sm">
                <span className={trade.side === "call" ? "text-up" : "text-down"}>
                  {trade.symbol} {trade.side === "call" ? "alta" : "baixa"}
                </span>
                <span className="font-display text-base tabular-nums">{mmss(left)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function BotPanel() {
  useMarketVersion();
  const botOn = useDesk((s) => s.botOn);
  const botStake = useDesk((s) => s.botStake);
  const setBotStake = useDesk((s) => s.setBotStake);
  const goalMode = useDesk((s) => s.goalMode);
  const setGoalMode = useDesk((s) => s.setGoalMode);
  const goalBrl = useDesk((s) => s.goalBrl);
  const goalPct = useDesk((s) => s.goalPct);
  const setGoal = useDesk((s) => s.setGoal);
  const startBot = useDesk((s) => s.startBot);
  const stopBot = useDesk((s) => s.stopBot);
  const wins = useDesk((s) => s.botWins);
  const losses = useDesk((s) => s.botLosses);
  const botPnl = useDesk((s) => s.botPnl);
  const note = useDesk((s) => s.botNote);
  const nextBotAt = useDesk((s) => s.nextBotAt);
  const cooldownUntil = useDesk((s) => s.cooldownUntil);
  const open = useDesk((s) => s.openTrades.find((t) => t.source === "bot"));
  const assetId = useDesk((s) => s.assetId);
  const botBase = useDesk((s) => s.botBase);
  const target = goalAmount({ goalMode, goalBrl, goalPct, botBase });
  const progress = target > 0 ? Math.max(0, Math.min(100, (botPnl / target) * 100)) : 0;
  const now = Date.now();
  const scanning = botOn && !open;
  const wobble = scanning ? Math.sin(now / 380) * 7 : 0;
  const needle = open ? (open.side === "call" ? 78 : 22) : botOn ? progress + wobble : 4;
  const color = open ? (open.side === "call" ? "up" : "down") : botOn ? "gold" : "muted";
  const caption = open ? (open.side === "call" ? "ALTA" : "BAIXA") : botOn ? "ANALISANDO" : "PARADO";
  const symbol = market.get(assetId).def.symbol;
  const wait = botOn ? Math.max(0, nextBotAt - now) : Math.max(0, cooldownUntil - now);

  return (
    <section className="rounded-lg border border-line bg-panel p-3" data-testid="bot">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold tracking-wide">ORION</h2>
        <span className="flex items-center gap-2 text-xs text-muted">
          <i className="inline-block size-2 rounded-full bg-up" />
          Livro sintético · {symbol}
        </span>
      </div>
      <Gauge percent={needle} caption={caption} color={color} />
      {!botOn ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs tracking-widest text-muted uppercase">
              Valor
              <input
                data-testid="bot-stake"
                inputMode="decimal"
                type="number"
                min={5}
                value={botStake || ""}
                onChange={(event) => setBotStake(Number(event.target.value))}
                className="mt-1 h-11 w-full rounded-md border border-line bg-bg px-2 font-display text-xl font-semibold text-fg outline-none focus:border-up"
              />
            </label>
            <label className="text-xs tracking-widest text-muted uppercase">
              <span className="flex items-center justify-between">
                Meta
                <span className="inline-flex gap-1 normal-case">
                  <Unit on={goalMode === "pct"} onClick={() => setGoalMode("pct")}>
                    %
                  </Unit>
                  <Unit on={goalMode === "brl"} onClick={() => setGoalMode("brl")}>
                    R$
                  </Unit>
                </span>
              </span>
              <input
                data-testid="bot-goal"
                inputMode="decimal"
                type="number"
                min={1}
                value={goalMode === "brl" ? goalBrl || "" : goalPct || ""}
                onChange={(event) => setGoal(Number(event.target.value))}
                className="mt-1 h-11 w-full rounded-md border border-line bg-bg px-2 font-display text-xl font-semibold text-fg outline-none focus:border-up"
              />
            </label>
          </div>
          <button
            type="button"
            data-testid="bot-start"
            onClick={startBot}
            className="h-12 rounded-md bg-up font-display text-xl font-bold tracking-widest text-ink"
          >
            INICIAR
          </button>
          {note && <p className="text-center text-sm text-gold">{note}</p>}
          {wait > 0 && <p className="text-center text-sm text-muted">Intervalo {mmss(wait)}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs tracking-widest text-muted uppercase">Acerto</span>
            <span className="font-display text-2xl font-bold">
              <span className="text-up">{wins}</span>
              <span className="px-1 text-faint">×</span>
              <span className="text-down">{losses}</span>
            </span>
          </div>
          <Row label={open ? "No ar" : "Próxima"} value={open ? mmss(open.openAt + open.expiryMs - now) : mmss(wait)} />
          <div className="h-1 overflow-hidden rounded-full bg-panel-2">
            <div className="h-full bg-gold" style={{ width: `${open ? timePct(open) : 12}%` }} />
          </div>
          <Row label="Resultado" value={signedBrl(botPnl)} tone={botPnl >= 0 ? "up" : "down"} />
          <Row label="Meta" value={goalMode === "brl" ? brl(goalBrl) : `${goalPct}% · ${brl(target)}`} />
          <div className="h-1 overflow-hidden rounded-full bg-panel-2">
            <div className="h-full bg-up" style={{ width: `${progress}%` }} />
          </div>
          <button
            type="button"
            data-testid="bot-stop"
            onClick={stopBot}
            className="mt-1 h-12 rounded-md bg-down font-display text-xl font-bold tracking-widest text-fg"
          >
            DESLIGAR
          </button>
          {note && <p className="text-center text-sm text-gold">{note}</p>}
        </div>
      )}
    </section>
  );
}

function timePct(trade: { openAt: number; expiryMs: number }) {
  const gone = Date.now() - trade.openAt;
  return Math.max(4, Math.min(100, (gone / trade.expiryMs) * 100));
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs tracking-widest text-muted uppercase">{label}</span>
      <span className={`font-display text-lg font-semibold tabular-nums ${tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg"}`}>
        {value}
      </span>
    </div>
  );
}

function Unit({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        on
          ? "rounded bg-up px-2 py-1 font-display text-xs font-bold text-ink"
          : "rounded bg-panel-2 px-2 py-1 font-display text-xs font-bold text-muted"
      }
    >
      {children}
    </button>
  );
}
