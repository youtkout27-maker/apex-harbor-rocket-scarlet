export type StyleId = "momentum" | "reversion" | "breakout";

export type Trader = {
  id: string;
  name: string;
  style: StyleId;
  styleLabel: string;
  market: string;
  risk: "Baixo" | "Médio" | "Alto";
  assets: string[];
  everyMs: number;
};

export const TRADERS: Trader[] = [
  {
    id: "lyra",
    name: "Lyra Vega",
    style: "momentum",
    styleLabel: "Momentum curto",
    market: "Forex",
    risk: "Baixo",
    assets: ["eurusd", "gbpusd"],
    everyMs: 22000,
  },
  {
    id: "kael",
    name: "Kael Nadir",
    style: "reversion",
    styleLabel: "Reversão",
    market: "Índices",
    risk: "Médio",
    assets: ["us500", "nas100"],
    everyMs: 26000,
  },
  {
    id: "nori",
    name: "Nori Atlas",
    style: "breakout",
    styleLabel: "Rompimento",
    market: "Cripto",
    risk: "Alto",
    assets: ["btcusd", "ethusd"],
    everyMs: 18000,
  },
  {
    id: "ion",
    name: "Ione Quasar",
    style: "momentum",
    styleLabel: "Tendência",
    market: "Ouro",
    risk: "Médio",
    assets: ["xauusd", "xagusd"],
    everyMs: 24000,
  },
  {
    id: "silo",
    name: "Silo Vega",
    style: "reversion",
    styleLabel: "Scalp",
    market: "USD/BRL",
    risk: "Alto",
    assets: ["usdbrl", "audusd"],
    everyMs: 16000,
  },
  {
    id: "mira",
    name: "Mira Helix",
    style: "momentum",
    styleLabel: "Misto",
    market: "Multi",
    risk: "Baixo",
    assets: ["eurusd", "btcusd", "xauusd", "us500"],
    everyMs: 20000,
  },
];

export function traderById(id: string | undefined) {
  return TRADERS.find((t) => t.id === id);
}
