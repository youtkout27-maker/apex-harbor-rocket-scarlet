import { brl } from "@/lib/format";
import { useDesk, type AccountId } from "@/lib/desk";

export function Perfil() {
  const account = useDesk((s) => s.account);
  const balances = useDesk((s) => s.balances);
  const setAccount = useDesk((s) => s.setAccount);
  const alias = useDesk((s) => s.alias);
  const setAlias = useDesk((s) => s.setAlias);
  const hideName = useDesk((s) => s.hideName);
  const setHideName = useDesk((s) => s.setHideName);
  const notify = useDesk((s) => s.notify);
  const setNotify = useDesk((s) => s.setNotify);
  const sound = useDesk((s) => s.sound);
  const setSound = useDesk((s) => s.setSound);
  const bonusClaimed = useDesk((s) => s.bonusClaimed);
  const claimBonus = useDesk((s) => s.claimBonus);
  const promoUntil = useDesk((s) => s.promoUntil);
  const reset = useDesk((s) => s.reset);
  const notices = useDesk((s) => s.notices);
  const prazo =
    promoUntil > 0
      ? new Date(promoUntil).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
      : "nesta temporada";

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-auto p-3">
      <header>
        <h1 className="font-display text-3xl font-semibold">Perfil</h1>
        <p className="text-sm text-muted">Duas contas virtuais. Não há depósito, saque nem ordem real.</p>
      </header>

      <section className="rounded-lg border border-line bg-panel p-3">
        <h2 className="font-display text-lg font-semibold">Contas</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <AccountCard id="demo" current={account} balance={balances.demo} title="Demo" onPick={setAccount} />
          <AccountCard id="treino" current={account} balance={balances.treino} title="Treino" onPick={setAccount} />
        </div>
      </section>

      <button
        type="button"
        data-testid="bonus"
        disabled={bonusClaimed}
        onClick={claimBonus}
        className="flex items-center justify-between gap-3 rounded-lg bg-gold-dim px-4 py-4 text-left disabled:opacity-50"
      >
        <span>
          <span className="block font-display text-xl font-semibold text-gold">Bônus de simulação</span>
          <span className="text-sm text-muted">+{brl(500)} virtuais · até {prazo}</span>
        </span>
        <span className="font-display text-lg font-bold text-gold">{bonusClaimed ? "USADO" : "RESGATAR"}</span>
      </button>

      <section className="rounded-lg border border-line bg-panel p-3">
        <h2 className="font-display text-lg font-semibold">Identidade na sala</h2>
        <label className="mt-2 block text-sm text-muted" htmlFor="alias">
          Apelido
          <input
            id="alias"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
            className="mt-1 h-12 w-full rounded-md border border-line bg-bg px-3 text-fg outline-none focus:border-gold"
          />
        </label>
        <Toggle on={hideName} onClick={() => setHideName(!hideName)} label="Ocultar apelido no copy" />
      </section>

      <section className="rounded-lg border border-line bg-panel p-3">
        <h2 className="font-display text-lg font-semibold">Avisos</h2>
        <Toggle on={notify} onClick={() => setNotify(!notify)} label="Avisos de resultado" />
        <Toggle on={sound} onClick={() => setSound(!sound)} label="Som curto ao fechar" />
        <button
          type="button"
          onClick={() => {
            if (typeof Notification === "undefined") return;
            void Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("Orion Desk", { body: "Você recebe o resultado das operações neste aparelho." });
              }
            });
          }}
          className="mt-2 h-11 rounded-md border border-line px-4 text-sm"
        >
          Permitir avisos do navegador
        </button>
        <ul className="mt-3 flex flex-col gap-2">
          {notices.length === 0 && <li className="text-sm text-muted">Nenhum aviso ainda.</li>}
          {notices.slice(0, 6).map((item) => (
            <li key={item.id} className="text-sm">
              <span className={item.tone === "up" ? "text-up" : item.tone === "down" ? "text-down" : item.tone === "gold" ? "text-gold" : "text-muted"}>
                {item.title}
              </span>
              <span className="text-muted"> · {item.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-line bg-panel p-3 text-sm text-muted">
        <h2 className="font-display text-lg font-semibold text-fg">O que isto é</h2>
        <p className="mt-2">
          Orion Desk é um simulador de mesa: gráfico, alta/baixa, robô e copy rodam só no seu navegador, com saldo
          fictício. Não é corretora, não executa ordem em mercado nenhum e não promete ganho. O pagamento de cada
          ativo fica abaixo de 100%, então uma estratégia sem vantagem perde no agregado.
        </p>
        <button type="button" onClick={reset} className="mt-3 h-11 rounded-md border border-line px-4 text-fg">
          Restaurar saldos
        </button>
      </section>
    </div>
  );
}

function AccountCard({
  id,
  current,
  balance,
  title,
  onPick,
}: {
  id: AccountId;
  current: AccountId;
  balance: number;
  title: string;
  onPick: (id: AccountId) => void;
}) {
  const on = current === id;
  return (
    <button
      type="button"
      onClick={() => onPick(id)}
      className={
        on
          ? "rounded-md border border-up bg-up-dim px-3 py-3 text-left"
          : "rounded-md border border-line px-3 py-3 text-left"
      }
    >
      <div className="text-xs tracking-widest text-muted uppercase">{title}</div>
      <div className="font-display text-xl font-semibold tabular-nums">{brl(balance)}</div>
    </button>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="mt-3 flex h-12 w-full items-center justify-between gap-3 text-left">
      <span>{label}</span>
      <span className={on ? "rounded-full bg-up px-3 py-1 text-sm font-semibold text-ink" : "rounded-full bg-panel-2 px-3 py-1 text-sm text-muted"}>
        {on ? "Ligado" : "Desligado"}
      </span>
    </button>
  );
}
