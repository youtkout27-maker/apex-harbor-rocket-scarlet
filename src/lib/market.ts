import { useSyncExternalStore } from "react";

export type Kind = "Forex" | "Cripto" | "Índice" | "Commodity" | "Ação";

export type AssetDef = {
  id: string;
  symbol: string;
  name: string;
  kind: Kind;
  digits: number;
  payout: number;
  vol: number;
  seed: number;
};

export type Candle = { t: number; o: number; h: number; l: number; c: number };

export type Signal = {
  id: string;
  traderId: string;
  assetId: string;
  side: "call" | "put";
  at: number;
  price: number;
};

export const ASSETS: AssetDef[] = [
  { id: "eurusd", symbol: "EUR/USD", name: "Euro / Dólar", kind: "Forex", digits: 5, payout: 0.85, vol: 0.00022, seed: 1.0862 },
  { id: "gbpusd", symbol: "GBP/USD", name: "Libra / Dólar", kind: "Forex", digits: 5, payout: 0.83, vol: 0.00026, seed: 1.3124 },
  { id: "usdjpy", symbol: "USD/JPY", name: "Dólar / Iene", kind: "Forex", digits: 3, payout: 0.84, vol: 0.00024, seed: 149.82 },
  { id: "audusd", symbol: "AUD/USD", name: "Dólar australiano", kind: "Forex", digits: 5, payout: 0.82, vol: 0.00028, seed: 0.6621 },
  { id: "usdbrl", symbol: "USD/BRL", name: "Dólar / Real", kind: "Forex", digits: 4, payout: 0.8, vol: 0.00034, seed: 5.421 },
  { id: "btcusd", symbol: "BTC/USD", name: "Bitcoin", kind: "Cripto", digits: 2, payout: 0.88, vol: 0.0009, seed: 67240 },
  { id: "ethusd", symbol: "ETH/USD", name: "Ethereum", kind: "Cripto", digits: 2, payout: 0.87, vol: 0.00105, seed: 3240 },
  { id: "xrpusd", symbol: "XRP/USD", name: "XRP", kind: "Cripto", digits: 4, payout: 0.86, vol: 0.0012, seed: 0.542 },
  { id: "xauusd", symbol: "XAU/USD", name: "Ouro", kind: "Commodity", digits: 2, payout: 0.84, vol: 0.0004, seed: 2684 },
  { id: "xagusd", symbol: "XAG/USD", name: "Prata", kind: "Commodity", digits: 3, payout: 0.81, vol: 0.00062, seed: 31.42 },
  { id: "us500", symbol: "US 500", name: "Índice americano", kind: "Índice", digits: 2, payout: 0.83, vol: 0.00032, seed: 5742 },
  { id: "nas100", symbol: "NAS 100", name: "Nasdaq 100", kind: "Índice", digits: 2, payout: 0.82, vol: 0.00042, seed: 20150 },
  { id: "petr4", symbol: "PETR4", name: "Petrobras PN", kind: "Ação", digits: 2, payout: 0.79, vol: 0.0007, seed: 36.42 },
  { id: "vale3", symbol: "VALE3", name: "Vale ON", kind: "Ação", digits: 2, payout: 0.78, vol: 0.00075, seed: 61.15 },
];

const CANDLE_MS = 4000;

type Live = {
  def: AssetDef;
  price: number;
  dayOpen: number;
  candles: Candle[];
  forming: Candle;
  prices: number[];
};

function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function nudge(price: number, vol: number) {
  return Math.max(price * 0.2, price * (1 + vol * randn()));
}

function makeLive(def: AssetDef, now: number): Live {
  const forming: Candle = { t: Math.floor(now / CANDLE_MS) * CANDLE_MS, o: def.seed, h: def.seed, l: def.seed, c: def.seed };
  return { def, price: def.seed, dayOpen: def.seed, candles: [], forming, prices: [def.seed] };
}

const lives = new Map<string, Live>();
for (const def of ASSETS) lives.set(def.id, makeLive(def, 0));

let version = 0;
let booted = false;
const listeners = new Set<() => void>();
const signals: Signal[] = [];

function emit() {
  version += 1;
  listeners.forEach((fn) => fn());
}

export const market = {
  get booted() {
    return booted;
  },
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getVersion() {
    return version;
  },
  bootstrap() {
    if (booted) return;
    const now = Date.now();
    for (const def of ASSETS) {
      let price = def.seed;
      const candles: Candle[] = [];
      for (let i = 72; i >= 1; i--) {
        const t = Math.floor(now / CANDLE_MS) * CANDLE_MS - i * CANDLE_MS;
        const o = price;
        let h = price;
        let l = price;
        for (let k = 0; k < 8; k++) {
          price = nudge(price, def.vol * 1.15);
          h = Math.max(h, price);
          l = Math.min(l, price);
        }
        candles.push({ t, o, h, l, c: price });
      }
      const bucket = Math.floor(now / CANDLE_MS) * CANDLE_MS;
      lives.set(def.id, {
        def,
        price,
        dayOpen: candles[0]?.o ?? def.seed,
        candles,
        forming: { t: bucket, o: price, h: price, l: price, c: price },
        prices: [price],
      });
    }
    booted = true;
  },
  step() {
    if (!booted) this.bootstrap();
    const now = Date.now();
    const bucket = Math.floor(now / CANDLE_MS) * CANDLE_MS;
    for (const live of lives.values()) {
      live.price = nudge(live.price, live.def.vol);
      live.prices.push(live.price);
      if (live.prices.length > 48) live.prices.shift();
      if (bucket !== live.forming.t) {
        live.candles.push(live.forming);
        if (live.candles.length > 80) live.candles.shift();
        live.forming = { t: bucket, o: live.price, h: live.price, l: live.price, c: live.price };
      } else {
        live.forming.h = Math.max(live.forming.h, live.price);
        live.forming.l = Math.min(live.forming.l, live.price);
        live.forming.c = live.price;
      }
    }
  },
  emit,
  list() {
    return ASSETS.map((def) => lives.get(def.id)!);
  },
  get(id: string) {
    return lives.get(id) ?? lives.get("eurusd")!;
  },
  price(id: string) {
    return this.get(id).price;
  },
  candles(id: string) {
    const live = this.get(id);
    return live.candles.concat(live.forming);
  },
  slope(id: string, n = 12) {
    const prices = this.get(id).prices;
    if (prices.length < 3) return 0;
    const slice = prices.slice(-n);
    const a = slice[0] ?? 0;
    const b = slice[slice.length - 1] ?? a;
    if (!a) return 0;
    return (b - a) / a;
  },
  pushSignal(signal: Signal) {
    signals.unshift(signal);
    if (signals.length > 30) signals.pop();
  },
  get signals() {
    return signals;
  },
};

export function useMarketVersion() {
  return useSyncExternalStore(market.subscribe, market.getVersion, market.getVersion);
}
