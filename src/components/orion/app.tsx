import { useEffect, useState } from "react";
import { ChartCandlestick, Copy, ScrollText, UserRound, Layers } from "lucide-react";
import { Mark } from "@/components/orion/mark";
import { Sala } from "@/components/orion/sala";
import { Ativos } from "@/components/orion/ativos";
import { CopyView } from "@/components/orion/copy-view";
import { Ops } from "@/components/orion/ops";
import { Perfil } from "@/components/orion/perfil";
import { brl, clock } from "@/lib/format";
import { startEngine, stopEngine, useDesk, type View } from "@/lib/desk";
import { useMarketVersion } from "@/lib/market";

const NAV: Array<{ id: View; label: string; icon: typeof Layers }> = [
  { id: "sala", label: "Sala", icon: ChartCandlestick },
  { id: "ativos", label: "Ativos", icon: Layers },
  { id: "copy", label: "Copy", icon: Copy },
  { id: "ops", label: "Ops", icon: ScrollText },
  { id: "perfil", label: "Perfil", icon: UserRound },
];

export function DeskApp() {
  const view = useDesk((s) => s.view);

  useEffect(() => {
    void useDesk.persist.rehydrate();
    useDesk.getState().ensurePromo();
    startEngine();
    return () => stopEngine();
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden text-fg">
      <TopBar />
      <main className="min-h-0 flex-1">
        {view === "sala" && <Sala />}
        {view === "ativos" && <Ativos />}
        {view === "copy" && <CopyView />}
        {view === "ops" && <Ops />}
        {view === "perfil" && <Perfil />}
      </main>
      <Toasts />
      <nav className="grid grid-cols-5 border-t border-line bg-panel">
        {NAV.map((item) => {
          const Icon = item.icon;
          const on = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-testid={`nav-${item.id}`}
              onClick={() => useDesk.getState().setView(item.id)}
              className={on ? "flex h-16 flex-col items-center justify-center gap-1 text-gold" : "flex h-16 flex-col items-center justify-center gap-1 text-muted"}
            >
              <Icon className="size-5" strokeWidth={1.75} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function TopBar() {
  const version = useMarketVersion();
  const account = useDesk((s) => s.account);
  const balance = useDesk((s) => s.balances[s.account]);
  const setAccount = useDesk((s) => s.setAccount);
  const [time, setTime] = useState("—");
  useEffect(() => {
    setTime(clock());
  }, [version]);
  return (
    <header className="flex items-center gap-3 border-b border-line bg-panel px-3 py-2">
      <Mark className="size-7 shrink-0 text-gold" />
      <div className="min-w-0">
        <div className="font-display text-xl leading-none font-bold tracking-widest">ORION</div>
        <div className="text-xs tracking-wide text-muted">PAPEL</div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="text-right">
          <div className="text-xs tracking-widest text-muted uppercase">{account === "demo" ? "Demo" : "Treino"}</div>
          <div className="font-display text-lg leading-none font-semibold tabular-nums" data-testid="balance">
            {brl(balance)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAccount(account === "demo" ? "treino" : "demo")}
          className="h-11 rounded-md border border-line px-3 text-sm"
        >
          Trocar
        </button>
        <span className="hidden font-display text-sm tabular-nums text-muted sm:inline">{time}</span>
      </div>
    </header>
  );
}

function Toasts() {
  useMarketVersion();
  const notices = useDesk((s) => s.notices);
  const fresh = notices.filter((item) => Date.now() - item.at < 4200).slice(0, 3);
  if (!fresh.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-30 flex flex-col items-center gap-2 px-3">
      {fresh.map((item) => (
        <div
          key={item.id}
          className="w-full max-w-md rounded-lg border border-gold bg-panel px-4 py-3 text-center text-sm text-gold shadow-lg"
        >
          <b>{item.title}</b>
          <span className="text-fg"> · {item.body}</span>
        </div>
      ))}
    </div>
  );
}
