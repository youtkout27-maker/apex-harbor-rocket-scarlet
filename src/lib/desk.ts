import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { market } from "@/lib/market";
import { TRADERS, type StyleId } from "@/lib/traders";

export type AccountId = "demo" | "treino";
export type Side = "call" | "put";
export type Source = "manual" | "bot" | "copy";
export type View = "sala" | "ativos" | "copy" | "ops" | "perfil";
export type GoalMode = "brl" | "pct";

export type OpenTrade = {
  id: string;
  assetId: string;
  symbol: string;
  digits: number;
  side: Side;
  stake: number;
  payout: number;
  openPrice: number;
  openAt: number;
  expiryMs: number;
  source: Source;
  account: AccountId;
  traderId?: string;
};

export type ClosedTrade = OpenTrade & {
  closePrice: number;
  closedAt: number;
  result: "win" | "loss" | "tie";
  pnl: number;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  tone: "up" | "down" | "gold" | "muted";
  at: number;
};

type Data = {
  view: View;
  account: AccountId;
  balances: Record<AccountId, number>;
  assetId: string;
  stake: number;
  botStake: number;
  copyStake: number;
  expiryMs: number;
  goalMode: GoalMode;
  goalBrl: number;
  goalPct: number;
  botOn: boolean;
  botWins: number;
  botLosses: number;
  botPnl: number;
  botBase: number;
  nextBotAt: number;
  cooldownUntil: number;
  botNote: string;
  openTrades: OpenTrade[];
  history: ClosedTrade[];
  following: string | null;
  notify: boolean;
  sound: boolean;
  hideName: boolean;
  alias: string;
  bonusClaimed: boolean;
  promoUntil: number;
  notices: Notice[];
};

type Actions = {
  setView: (view: View) => void;
  setAccount: (account: AccountId) => void;
  setAsset: (assetId: string) => void;
  setStake: (n: number) => void;
  setBotStake: (n: number) => void;
  setCopyStake: (n: number) => void;
  setExpiry: (ms: number) => void;
  setGoalMode: (mode: GoalMode) => void;
  setGoal: (n: number) => void;
  setFollowing: (id: string | null) => void;
  setNotify: (on: boolean) => void;
  setSound: (on: boolean) => void;
  setHideName: (on: boolean) => void;
  setAlias: (alias: string) => void;
  startBot: () => void;
  stopBot: () => void;
  manual: (side: Side) => void;
  claimBonus: () => void;
  reset: () => void;
  ensurePromo: () => void;
};

export type Desk = Data & Actions;

const EXPIRIES = [15000, 30000, 60000, 300000];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function money(n: number) {
  return Math.round(n * 100) / 100;
}

function clampStake(n: number) {
  if (!Number.isFinite(n)) return 0;
  return money(Math.min(5000, Math.max(0, n)));
}

let audioCtx: AudioContext | null = null;

function beep(win: boolean) {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = win ? 740 : 196;
    gain.gain.value = 0.03;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch {
    /* autoplay policies vary */
  }
}

function ping(title: string, body: string, notify: boolean) {
  if (!notify || typeof window === "undefined" || typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body });
  } catch {
    /* preview may block notifications */
  }
}

function notice(title: string, body: string, tone: Notice["tone"], list: Notice[]): Notice[] {
  return [{ id: uid(), title, body, tone, at: Date.now() }, ...list].slice(0, 16);
}

const initial: Data = {
  view: "sala",
  account: "demo",
  balances: { demo: 10000, treino: 1000 },
  assetId: "eurusd",
  stake: 25,
  botStake: 25,
  copyStake: 25,
  expiryMs: 15000,
  goalMode: "brl",
  goalBrl: 100,
  goalPct: 20,
  botOn: false,
  botWins: 0,
  botLosses: 0,
  botPnl: 0,
  botBase: 10000,
  nextBotAt: 0,
  cooldownUntil: 0,
  botNote: "",
  openTrades: [],
  history: [],
  following: null,
  notify: true,
  sound: true,
  hideName: false,
  alias: "Visitante",
  bonusClaimed: false,
  promoUntil: 0,
  notices: [],
};

function storage() {
  if (typeof window === "undefined") {
    return { getItem: () => null, setItem: () => undefined, removeItem: () => undefined };
  }
  return localStorage;
}

function sideFrom(style: StyleId, slope: number): Side | null {
  if (style === "breakout" && Math.abs(slope) < 0.00008) return null;
  if (style === "reversion") return slope >= 0 ? "put" : "call";
  if (Math.abs(slope) < 0.00003) return Math.random() < 0.5 ? "call" : "put";
  return slope >= 0 ? "call" : "put";
}

type PlaceArgs = {
  assetId: string;
  side: Side;
  stake: number;
  expiryMs: number;
  source: Source;
  traderId?: string;
  now: number;
};

function applyPlace(s: Data, args: PlaceArgs): { patch: Partial<Data>; error?: string } {
  const live = market.get(args.assetId);
  if (args.stake < 5) return { patch: {}, error: "Valor mínimo: R$ 5." };
  if (args.source === "manual" && s.openTrades.filter((t) => t.source === "manual").length >= 5) {
    return { patch: {}, error: "Feche uma operação manual antes de abrir outra." };
  }
  const bal = s.balances[s.account];
  if (bal < args.stake) return { patch: {}, error: "Saldo virtual insuficiente." };
  const trade: OpenTrade = {
    id: uid(),
    assetId: live.def.id,
    symbol: live.def.symbol,
    digits: live.def.digits,
    side: args.side,
    stake: args.stake,
    payout: live.def.payout,
    openPrice: live.price,
    openAt: args.now,
    expiryMs: args.expiryMs,
    source: args.source,
    account: s.account,
    traderId: args.traderId,
  };
  return {
    patch: {
      balances: { ...s.balances, [s.account]: money(bal - args.stake) },
      openTrades: [...s.openTrades, trade],
    },
  };
}

function merge(base: Data, ...patches: Array<Partial<Data> | null | undefined>): Data {
  return patches.reduce<Data>((acc, patch) => (patch ? { ...acc, ...patch } : acc), base);
}

const nextSignal = new Map<string, number>();
let copyBroke = false;

function settle(s: Data, now: number): Partial<Data> | null {
  const due = s.openTrades.filter((t) => now >= t.openAt + t.expiryMs);
  if (!due.length) return null;
  const balances = { ...s.balances };
  let botWins = s.botWins;
  let botLosses = s.botLosses;
  let botPnl = s.botPnl;
  let botOn = s.botOn;
  let botNote = s.botNote;
  let cooldownUntil = s.cooldownUntil;
  let notices = s.notices;
  const closed: ClosedTrade[] = [];

  for (const trade of due) {
    const closePrice = market.price(trade.assetId);
    const up = closePrice > trade.openPrice;
    const down = closePrice < trade.openPrice;
    const win = (trade.side === "call" && up) || (trade.side === "put" && down);
    const tie = !up && !down;
    const result: ClosedTrade["result"] = tie ? "tie" : win ? "win" : "loss";
    const pnl = tie ? 0 : win ? money(trade.stake * trade.payout) : -trade.stake;
    const credit = tie ? trade.stake : win ? money(trade.stake * (1 + trade.payout)) : 0;
    balances[trade.account] = money(balances[trade.account] + credit);
    const row: ClosedTrade = { ...trade, closePrice, closedAt: now, result, pnl };
    closed.push(row);
    if (trade.source === "bot") {
      botPnl = money(botPnl + pnl);
      if (win) botWins += 1;
      else if (!tie) botLosses += 1;
      const goal = s.goalMode === "brl" ? s.goalBrl : s.botBase * (s.goalPct / 100);
      if (botOn && goal > 0 && botPnl >= goal) {
        botOn = false;
        botNote = "Meta atingida nesta sessão. O robô parou.";
        cooldownUntil = now + 15000;
      }
    }
    const verb = result === "win" ? "Ganho" : result === "loss" ? "Perda" : "Empate";
    const tone: Notice["tone"] = result === "win" ? "up" : result === "loss" ? "down" : "muted";
    const who = trade.source === "bot" ? "Robô" : trade.source === "copy" ? "Copy" : "Manual";
    notices = notice(`${who} · ${verb}`, `${trade.symbol} fechou em ${pnl >= 0 ? "lucro" : "prejuízo"}.`, tone, notices);
    if (s.sound && trade.source !== "copy") beep(result !== "loss");
    if (trade.source !== "copy") ping(`${who} · ${verb}`, trade.symbol, s.notify);
  }

  return {
    balances,
    openTrades: s.openTrades.filter((t) => now < t.openAt + t.expiryMs),
    history: [...closed.reverse(), ...s.history].slice(0, 120),
    botWins,
    botLosses,
    botPnl,
    botOn,
    botNote,
    cooldownUntil,
    notices,
  };
}

function considerBot(s: Data, now: number): Partial<Data> | null {
  if (!s.botOn) return null;
  if (now < s.cooldownUntil) return null;
  if (s.openTrades.some((t) => t.source === "bot")) return null;
  if (now < s.nextBotAt) return null;
  const slope = market.slope(s.assetId, 14);
  if (Math.abs(slope) < 0.000025 && Math.random() < 0.7) {
    return { nextBotAt: now + 1200 };
  }
  const side: Side = slope >= 0 ? "call" : "put";
  const placed = applyPlace(s, {
    assetId: s.assetId,
    side,
    stake: s.botStake,
    expiryMs: s.expiryMs,
    source: "bot",
    now,
  });
  if (placed.error) {
    return {
      botOn: false,
      botNote: placed.error,
      cooldownUntil: now + 8000,
      notices: notice("Robô", placed.error, "gold", s.notices),
    };
  }
  return { ...placed.patch, nextBotAt: now + s.expiryMs + 1400 };
}

function considerCopy(s: Data, now: number): Partial<Data> | null {
  let patch: Partial<Data> | null = null;
  let working = s;
  for (const trader of TRADERS) {
    let dueAt = nextSignal.get(trader.id) ?? 0;
    if (!dueAt) {
      nextSignal.set(trader.id, now + 4000 + Math.random() * trader.everyMs);
      continue;
    }
    if (now < dueAt) continue;
    const assetId = trader.assets[Math.floor(Math.random() * trader.assets.length)] ?? trader.assets[0]!;
    const slope = market.slope(assetId, 16);
    const side = sideFrom(trader.style, slope);
    nextSignal.set(trader.id, now + trader.everyMs + Math.random() * 6000);
    if (!side) continue;
    const price = market.price(assetId);
    market.pushSignal({ id: uid(), traderId: trader.id, assetId, side, at: now, price });
    if (s.following !== trader.id) continue;
    if (working.openTrades.some((t) => t.source === "copy" && t.traderId === trader.id)) continue;
    const placed = applyPlace(working, {
      assetId,
      side,
      stake: working.copyStake,
      expiryMs: 20000,
      source: "copy",
      traderId: trader.id,
      now,
    });
    if (placed.error) {
      if (!copyBroke) {
        copyBroke = true;
        patch = {
          ...(patch ?? {}),
          notices: notice("Copy", `${trader.name}: ${placed.error}`, "gold", working.notices),
        };
      }
      continue;
    }
    copyBroke = false;
    working = merge(working, placed.patch);
    patch = { ...(patch ?? {}), ...placed.patch, notices: working.notices };
  }
  return patch;
}

export function engineTick() {
  market.step();
  const now = Date.now();
  let current: Data = useDesk.getState();
  const settled = settle(current, now);
  if (settled) current = merge(current, settled);
  const botPatch = considerBot(current, now);
  if (botPatch) current = merge(current, botPatch);
  const copyPatch = considerCopy(current, now);
  if (copyPatch) current = merge(current, copyPatch);
  if (settled || botPatch || copyPatch) {
    useDesk.setState({
      balances: current.balances,
      openTrades: current.openTrades,
      history: current.history,
      notices: current.notices,
      botWins: current.botWins,
      botLosses: current.botLosses,
      botPnl: current.botPnl,
      botOn: current.botOn,
      botNote: current.botNote,
      cooldownUntil: current.cooldownUntil,
      nextBotAt: current.nextBotAt,
    });
  }
  market.emit();
}

let timer: ReturnType<typeof setInterval> | null = null;

export function startEngine() {
  if (timer) return;
  market.bootstrap();
  timer = setInterval(engineTick, 200);
  market.emit();
}

export function stopEngine() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

export const useDesk = create<Desk>()(
  persist(
    (set, get) => ({
      ...initial,
      setView: (view) => set({ view }),
      setAccount: (account) => {
        const s = get();
        if (s.account === account) return;
        set({
          account,
          botOn: false,
          botNote: s.botOn ? "Robô pausado ao trocar de conta." : s.botNote,
          cooldownUntil: s.botOn ? Date.now() + 4000 : s.cooldownUntil,
        });
      },
      setAsset: (assetId) => set({ assetId }),
      setStake: (n) => set({ stake: clampStake(n) }),
      setBotStake: (n) => set({ botStake: clampStake(n) }),
      setCopyStake: (n) => set({ copyStake: clampStake(n) }),
      setExpiry: (ms) => {
        if (!EXPIRIES.includes(ms)) return;
        set({ expiryMs: ms });
      },
      setGoalMode: (goalMode) => set({ goalMode }),
      setGoal: (n) => {
        if (!Number.isFinite(n) || n < 0) return;
        const value = money(Math.min(100000, n));
        if (get().goalMode === "brl") set({ goalBrl: value });
        else set({ goalPct: Math.min(500, value) });
      },
      setFollowing: (following) => {
        copyBroke = false;
        set({ following });
      },
      setNotify: (notify) => set({ notify }),
      setSound: (sound) => set({ sound }),
      setHideName: (hideName) => set({ hideName }),
      setAlias: (alias) => set({ alias: alias.slice(0, 24) }),
      startBot: () => {
        const s = get();
        if (s.botOn) return;
        const goal = s.goalMode === "brl" ? s.goalBrl : s.goalPct;
        if (!(goal > 0)) {
          set({ notices: notice("Robô", "Informe a meta de lucro.", "gold", s.notices) });
          return;
        }
        if (s.botStake < 5) {
          set({ notices: notice("Robô", "Valor mínimo: R$ 5.", "gold", s.notices) });
          return;
        }
        if (Date.now() < s.cooldownUntil) {
          set({ notices: notice("Robô", "Aguarde o intervalo entre as sessões.", "gold", s.notices) });
          return;
        }
        if (s.balances[s.account] < s.botStake) {
          set({ notices: notice("Robô", "Saldo virtual insuficiente.", "gold", s.notices) });
          return;
        }
        set({
          botOn: true,
          botWins: 0,
          botLosses: 0,
          botPnl: 0,
          botBase: s.balances[s.account],
          nextBotAt: Date.now() + 700,
          botNote: "",
        });
      },
      stopBot: () => {
        set({
          botOn: false,
          cooldownUntil: Date.now() + 8000,
          botNote: "Robô desligado.",
        });
      },
      manual: (side) => {
        const s = get();
        const placed = applyPlace(s, {
          assetId: s.assetId,
          side,
          stake: s.stake,
          expiryMs: s.expiryMs,
          source: "manual",
          now: Date.now(),
        });
        if (placed.error) {
          set({ notices: notice("Ordem", placed.error, "gold", s.notices) });
          return;
        }
        set(placed.patch);
      },
      claimBonus: () => {
        const s = get();
        if (s.bonusClaimed) return;
        set({
          bonusClaimed: true,
          balances: { ...s.balances, [s.account]: money(s.balances[s.account] + 500) },
          notices: notice("Bônus de simulação", "R$ 500 virtuais creditados nesta conta.", "gold", s.notices),
        });
      },
      reset: () => {
        set({
          balances: { demo: 10000, treino: 1000 },
          openTrades: [],
          history: [],
          botOn: false,
          botWins: 0,
          botLosses: 0,
          botPnl: 0,
          botNote: "",
          following: null,
          bonusClaimed: false,
          notices: notice("Reinício", "Saldos de simulação restaurados.", "muted", []),
        });
      },
      ensurePromo: () => {
        if (get().promoUntil > 0) return;
        set({ promoUntil: Date.now() + 30 * 24 * 60 * 60 * 1000 });
      },
    }),
    {
      name: "orion-desk-v1",
      storage: createJSONStorage(storage),
      skipHydration: true,
      partialize: (s) => ({
        account: s.account,
        balances: s.balances,
        assetId: s.assetId,
        stake: s.stake,
        botStake: s.botStake,
        copyStake: s.copyStake,
        expiryMs: s.expiryMs,
        goalMode: s.goalMode,
        goalBrl: s.goalBrl,
        goalPct: s.goalPct,
        history: s.history.slice(0, 80),
        following: s.following,
        notify: s.notify,
        sound: s.sound,
        hideName: s.hideName,
        alias: s.alias,
        bonusClaimed: s.bonusClaimed,
        promoUntil: s.promoUntil,
      }),
    },
  ),
);

export function goalAmount(s: Pick<Data, "goalMode" | "goalBrl" | "goalPct" | "botBase">) {
  return s.goalMode === "brl" ? s.goalBrl : money(s.botBase * (s.goalPct / 100));
}

export function useAlias() {
  const hide = useDesk((s) => s.hideName);
  const alias = useDesk((s) => s.alias);
  return hide ? "Anônimo" : alias.trim() || "Visitante";
}

export { EXPIRIES };
