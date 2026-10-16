import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Copy, i as Layers, o as ChartCandlestick, r as ScrollText, t as UserRound } from "../_libs/lucide-react.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CCCk6WPd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Mark({ className = "size-8" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6 50 L22 16 L32 36 L42 12 L58 50",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.4",
				strokeLinejoin: "round",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "16",
				r: "2.4",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "36",
				r: "2.2",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "42",
				cy: "12",
				r: "2.6",
				fill: "currentColor"
			})
		]
	});
}
var ASSETS = [
	{
		id: "eurusd",
		symbol: "EUR/USD",
		name: "Euro / Dólar",
		kind: "Forex",
		digits: 5,
		payout: .85,
		vol: 22e-5,
		seed: 1.0862
	},
	{
		id: "gbpusd",
		symbol: "GBP/USD",
		name: "Libra / Dólar",
		kind: "Forex",
		digits: 5,
		payout: .83,
		vol: 26e-5,
		seed: 1.3124
	},
	{
		id: "usdjpy",
		symbol: "USD/JPY",
		name: "Dólar / Iene",
		kind: "Forex",
		digits: 3,
		payout: .84,
		vol: 24e-5,
		seed: 149.82
	},
	{
		id: "audusd",
		symbol: "AUD/USD",
		name: "Dólar australiano",
		kind: "Forex",
		digits: 5,
		payout: .82,
		vol: 28e-5,
		seed: .6621
	},
	{
		id: "usdbrl",
		symbol: "USD/BRL",
		name: "Dólar / Real",
		kind: "Forex",
		digits: 4,
		payout: .8,
		vol: 34e-5,
		seed: 5.421
	},
	{
		id: "btcusd",
		symbol: "BTC/USD",
		name: "Bitcoin",
		kind: "Cripto",
		digits: 2,
		payout: .88,
		vol: 9e-4,
		seed: 67240
	},
	{
		id: "ethusd",
		symbol: "ETH/USD",
		name: "Ethereum",
		kind: "Cripto",
		digits: 2,
		payout: .87,
		vol: .00105,
		seed: 3240
	},
	{
		id: "xrpusd",
		symbol: "XRP/USD",
		name: "XRP",
		kind: "Cripto",
		digits: 4,
		payout: .86,
		vol: .0012,
		seed: .542
	},
	{
		id: "xauusd",
		symbol: "XAU/USD",
		name: "Ouro",
		kind: "Commodity",
		digits: 2,
		payout: .84,
		vol: 4e-4,
		seed: 2684
	},
	{
		id: "xagusd",
		symbol: "XAG/USD",
		name: "Prata",
		kind: "Commodity",
		digits: 3,
		payout: .81,
		vol: 62e-5,
		seed: 31.42
	},
	{
		id: "us500",
		symbol: "US 500",
		name: "Índice americano",
		kind: "Índice",
		digits: 2,
		payout: .83,
		vol: 32e-5,
		seed: 5742
	},
	{
		id: "nas100",
		symbol: "NAS 100",
		name: "Nasdaq 100",
		kind: "Índice",
		digits: 2,
		payout: .82,
		vol: 42e-5,
		seed: 20150
	},
	{
		id: "petr4",
		symbol: "PETR4",
		name: "Petrobras PN",
		kind: "Ação",
		digits: 2,
		payout: .79,
		vol: 7e-4,
		seed: 36.42
	},
	{
		id: "vale3",
		symbol: "VALE3",
		name: "Vale ON",
		kind: "Ação",
		digits: 2,
		payout: .78,
		vol: 75e-5,
		seed: 61.15
	}
];
var CANDLE_MS = 4e3;
function randn() {
	let u = 0;
	let v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function nudge(price, vol) {
	return Math.max(price * .2, price * (1 + vol * randn()));
}
function makeLive(def, now) {
	const forming = {
		t: Math.floor(now / CANDLE_MS) * CANDLE_MS,
		o: def.seed,
		h: def.seed,
		l: def.seed,
		c: def.seed
	};
	return {
		def,
		price: def.seed,
		dayOpen: def.seed,
		candles: [],
		forming,
		prices: [def.seed]
	};
}
var lives = /* @__PURE__ */ new Map();
for (const def of ASSETS) lives.set(def.id, makeLive(def, 0));
var version = 0;
var booted = false;
var listeners = /* @__PURE__ */ new Set();
var signals = [];
function emit() {
	version += 1;
	listeners.forEach((fn) => fn());
}
var market = {
	get booted() {
		return booted;
	},
	subscribe(cb) {
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
			const candles = [];
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
				candles.push({
					t,
					o,
					h,
					l,
					c: price
				});
			}
			const bucket = Math.floor(now / CANDLE_MS) * CANDLE_MS;
			lives.set(def.id, {
				def,
				price,
				dayOpen: candles[0]?.o ?? def.seed,
				candles,
				forming: {
					t: bucket,
					o: price,
					h: price,
					l: price,
					c: price
				},
				prices: [price]
			});
		}
		booted = true;
	},
	step() {
		if (!booted) this.bootstrap();
		const bucket = Math.floor(Date.now() / CANDLE_MS) * CANDLE_MS;
		for (const live of lives.values()) {
			live.price = nudge(live.price, live.def.vol);
			live.prices.push(live.price);
			if (live.prices.length > 48) live.prices.shift();
			if (bucket !== live.forming.t) {
				live.candles.push(live.forming);
				if (live.candles.length > 80) live.candles.shift();
				live.forming = {
					t: bucket,
					o: live.price,
					h: live.price,
					l: live.price,
					c: live.price
				};
			} else {
				live.forming.h = Math.max(live.forming.h, live.price);
				live.forming.l = Math.min(live.forming.l, live.price);
				live.forming.c = live.price;
			}
		}
	},
	emit,
	list() {
		return ASSETS.map((def) => lives.get(def.id));
	},
	get(id) {
		return lives.get(id) ?? lives.get("eurusd");
	},
	price(id) {
		return this.get(id).price;
	},
	candles(id) {
		const live = this.get(id);
		return live.candles.concat(live.forming);
	},
	slope(id, n = 12) {
		const prices = this.get(id).prices;
		if (prices.length < 3) return 0;
		const slice = prices.slice(-n);
		const a = slice[0] ?? 0;
		const b = slice[slice.length - 1] ?? a;
		if (!a) return 0;
		return (b - a) / a;
	},
	pushSignal(signal) {
		signals.unshift(signal);
		if (signals.length > 30) signals.pop();
	},
	get signals() {
		return signals;
	}
};
function useMarketVersion() {
	return (0, import_react.useSyncExternalStore)(market.subscribe, market.getVersion, market.getVersion);
}
function brl(n) {
	return n.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	});
}
function signedBrl(n) {
	const core = brl(Math.abs(n));
	if (n > 0) return `+${core}`;
	if (n < 0) return `−${core}`;
	return core;
}
function px(n, digits) {
	return n.toLocaleString("pt-BR", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function mmss(ms) {
	const s = Math.max(0, Math.ceil(ms / 1e3));
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${m}:${String(r).padStart(2, "0")}`;
}
function pct(n, digits = 2) {
	return `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("pt-BR", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	})}%`;
}
function clock(d = /* @__PURE__ */ new Date()) {
	return d.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
}
function cssColor(name, fallback) {
	if (typeof document === "undefined") return fallback;
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function PriceChart({ assetId, trades }) {
	const version = useMarketVersion();
	const box = (0, import_react.useRef)(null);
	const canvas = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const parent = box.current;
		const node = canvas.current;
		if (!parent || !node) return;
		const draw = () => {
			const width = parent.clientWidth;
			const height = parent.clientHeight;
			if (width < 8 || height < 8) return;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			node.width = Math.floor(width * dpr);
			node.height = Math.floor(height * dpr);
			const ctx = node.getContext("2d");
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const bg = cssColor("--color-panel", "#10141b");
			const grid = cssColor("--color-line", "#2a3340");
			const up = cssColor("--color-up", "#1fcb6b");
			const down = cssColor("--color-down", "#ff2e4c");
			const gold = cssColor("--color-gold", "#e9a825");
			cssColor("--color-fg", "#e8ebef");
			const muted = cssColor("--color-muted", "#8e98a6");
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, width, height);
			const live = market.get(assetId);
			const candles = market.candles(assetId);
			if (!market.booted || candles.length < 2) {
				ctx.fillStyle = muted;
				ctx.font = "13px Outfit, sans-serif";
				ctx.fillText("Preparando a série sintética…", 16, height / 2);
				return;
			}
			const padL = 8;
			const padR = 72;
			const padT = 12;
			const padB = 18;
			const plotW = width - padL - padR;
			const plotH = height - padT - padB;
			let min = Infinity;
			let max = -Infinity;
			for (const c of candles) {
				min = Math.min(min, c.l);
				max = Math.max(max, c.h);
			}
			const span = Math.max(max - min, live.price * 4e-4);
			min -= span * .08;
			max += span * .08;
			const yOf = (v) => padT + (max - v) / (max - min) * plotH;
			const slot = plotW / candles.length;
			ctx.strokeStyle = grid;
			ctx.lineWidth = 1;
			ctx.font = "11px Rajdhani, sans-serif";
			ctx.fillStyle = muted;
			for (let i = 0; i < 4; i++) {
				const value = max - (max - min) * i / 3;
				const y = yOf(value);
				ctx.beginPath();
				ctx.moveTo(padL, y);
				ctx.lineTo(width - padR + 6, y);
				ctx.stroke();
				ctx.fillText(px(value, live.def.digits), width - padR + 10, y + 4);
			}
			candles.forEach((candle, index) => {
				paintCandle(ctx, candle, padL + index * slot + slot / 2, Math.max(3, slot * .62), yOf, up, down);
			});
			const last = candles[candles.length - 1];
			const y = yOf(last.c);
			ctx.setLineDash([4, 4]);
			ctx.strokeStyle = last.c >= last.o ? up : down;
			ctx.beginPath();
			ctx.moveTo(padL, y);
			ctx.lineTo(width - padR + 4, y);
			ctx.stroke();
			ctx.setLineDash([]);
			for (const trade of trades) {
				if (trade.assetId !== assetId) continue;
				const ty = yOf(trade.openPrice);
				ctx.strokeStyle = trade.side === "call" ? up : down;
				ctx.globalAlpha = .85;
				ctx.beginPath();
				ctx.moveTo(padL, ty);
				ctx.lineTo(width - padR + 4, ty);
				ctx.stroke();
				ctx.globalAlpha = 1;
			}
			const tag = px(last.c, live.def.digits);
			const tagW = 64;
			ctx.fillStyle = last.c >= (candles[candles.length - 2]?.c ?? last.o) ? up : down;
			roundRect(ctx, width - padR + 6, y - 10, tagW, 20, 4);
			ctx.fill();
			ctx.fillStyle = cssColor("--color-ink", "#04150c");
			ctx.font = "700 13px Rajdhani, sans-serif";
			ctx.fillText(tag, width - padR + 10, y + 4);
			ctx.fillStyle = gold;
		};
		draw();
		const observer = new ResizeObserver(draw);
		observer.observe(parent);
		return () => observer.disconnect();
	}, [
		version,
		assetId,
		trades
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: box,
		className: "relative h-full min-h-56 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvas,
			className: "h-full w-full"
		})
	});
}
function paintCandle(ctx, candle, x, bodyW, yOf, up, down) {
	const bull = candle.c >= candle.o;
	ctx.strokeStyle = bull ? up : down;
	ctx.fillStyle = bull ? up : down;
	ctx.beginPath();
	ctx.moveTo(x, yOf(candle.h));
	ctx.lineTo(x, yOf(candle.l));
	ctx.stroke();
	const top = yOf(Math.max(candle.o, candle.c));
	const bot = yOf(Math.min(candle.o, candle.c));
	const h = Math.max(1, bot - top);
	ctx.fillRect(x - bodyW / 2, top, bodyW, h);
}
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}
var ARC_START = 150;
var ARC = 240;
var R = 78;
function pt(deg, radius = R) {
	const a = deg * Math.PI / 180;
	return {
		x: 120 + radius * Math.cos(a),
		y: 120 + radius * Math.sin(a)
	};
}
function Gauge({ percent, caption, color }) {
	const pct = Math.max(0, Math.min(100, percent));
	const tip = pt(ARC_START + pct / 100 * ARC, 62);
	const tone = color === "up" ? "text-up" : color === "down" ? "text-down" : color === "gold" ? "text-gold" : "text-faint";
	const ticks = Array.from({ length: 21 }, (_, i) => {
		const deg = ARC_START + i / 20 * ARC;
		return {
			i,
			outer: pt(deg, 90),
			inner: pt(deg, i % 5 === 0 ? 80 : 84),
			on: i / 20 <= pct / 100 + .001,
			major: i % 5 === 0
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative mx-auto w-44 ${tone}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 240 210",
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "120",
					cy: "120",
					r: "100",
					className: "fill-bg",
					opacity: "0.55"
				}),
				ticks.map((tick) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: tick.inner.x,
					y1: tick.inner.y,
					x2: tick.outer.x,
					y2: tick.outer.y,
					stroke: "currentColor",
					strokeOpacity: tick.on ? .95 : .2,
					strokeWidth: tick.major ? 2.4 : 1.3,
					strokeLinecap: "round"
				}, tick.i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "120",
					y1: "120",
					x2: tip.x,
					y2: tip.y,
					stroke: "currentColor",
					strokeWidth: "3",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "120",
					cy: "120",
					r: "5",
					fill: "currentColor"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-x-0 top-[58%] text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-4xl leading-none font-semibold tabular-nums",
				children: Math.round(pct)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs tracking-widest text-muted uppercase",
				children: caption
			})]
		})]
	});
}
var TRADERS = [
	{
		id: "lyra",
		name: "Lyra Vega",
		style: "momentum",
		styleLabel: "Momentum curto",
		market: "Forex",
		risk: "Baixo",
		assets: ["eurusd", "gbpusd"],
		everyMs: 22e3
	},
	{
		id: "kael",
		name: "Kael Nadir",
		style: "reversion",
		styleLabel: "Reversão",
		market: "Índices",
		risk: "Médio",
		assets: ["us500", "nas100"],
		everyMs: 26e3
	},
	{
		id: "nori",
		name: "Nori Atlas",
		style: "breakout",
		styleLabel: "Rompimento",
		market: "Cripto",
		risk: "Alto",
		assets: ["btcusd", "ethusd"],
		everyMs: 18e3
	},
	{
		id: "ion",
		name: "Ione Quasar",
		style: "momentum",
		styleLabel: "Tendência",
		market: "Ouro",
		risk: "Médio",
		assets: ["xauusd", "xagusd"],
		everyMs: 24e3
	},
	{
		id: "silo",
		name: "Silo Vega",
		style: "reversion",
		styleLabel: "Scalp",
		market: "USD/BRL",
		risk: "Alto",
		assets: ["usdbrl", "audusd"],
		everyMs: 16e3
	},
	{
		id: "mira",
		name: "Mira Helix",
		style: "momentum",
		styleLabel: "Misto",
		market: "Multi",
		risk: "Baixo",
		assets: [
			"eurusd",
			"btcusd",
			"xauusd",
			"us500"
		],
		everyMs: 2e4
	}
];
function traderById(id) {
	return TRADERS.find((t) => t.id === id);
}
var EXPIRIES = [
	15e3,
	3e4,
	6e4,
	3e5
];
function uid() {
	return Math.random().toString(36).slice(2, 10);
}
function money(n) {
	return Math.round(n * 100) / 100;
}
function clampStake(n) {
	if (!Number.isFinite(n)) return 0;
	return money(Math.min(5e3, Math.max(0, n)));
}
var audioCtx = null;
function beep(win) {
	if (typeof window === "undefined") return;
	try {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return;
		if (!audioCtx) audioCtx = new Ctx();
		const ctx = audioCtx;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "triangle";
		osc.frequency.value = win ? 740 : 196;
		gain.gain.value = .03;
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + .07);
	} catch {}
}
function ping(title, body, notify) {
	if (!notify || typeof window === "undefined" || typeof Notification === "undefined") return;
	if (Notification.permission !== "granted") return;
	try {
		new Notification(title, { body });
	} catch {}
}
function notice(title, body, tone, list) {
	return [{
		id: uid(),
		title,
		body,
		tone,
		at: Date.now()
	}, ...list].slice(0, 16);
}
var initial = {
	view: "sala",
	account: "demo",
	balances: {
		demo: 1e4,
		treino: 1e3
	},
	assetId: "eurusd",
	stake: 25,
	botStake: 25,
	copyStake: 25,
	expiryMs: 15e3,
	goalMode: "brl",
	goalBrl: 100,
	goalPct: 20,
	botOn: false,
	botWins: 0,
	botLosses: 0,
	botPnl: 0,
	botBase: 1e4,
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
	notices: []
};
function storage() {
	if (typeof window === "undefined") return {
		getItem: () => null,
		setItem: () => void 0,
		removeItem: () => void 0
	};
	return localStorage;
}
function sideFrom(style, slope) {
	if (style === "breakout" && Math.abs(slope) < 8e-5) return null;
	if (style === "reversion") return slope >= 0 ? "put" : "call";
	if (Math.abs(slope) < 3e-5) return Math.random() < .5 ? "call" : "put";
	return slope >= 0 ? "call" : "put";
}
function applyPlace(s, args) {
	const live = market.get(args.assetId);
	if (args.stake < 5) return {
		patch: {},
		error: "Valor mínimo: R$ 5."
	};
	if (args.source === "manual" && s.openTrades.filter((t) => t.source === "manual").length >= 5) return {
		patch: {},
		error: "Feche uma operação manual antes de abrir outra."
	};
	const bal = s.balances[s.account];
	if (bal < args.stake) return {
		patch: {},
		error: "Saldo virtual insuficiente."
	};
	const trade = {
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
		traderId: args.traderId
	};
	return { patch: {
		balances: {
			...s.balances,
			[s.account]: money(bal - args.stake)
		},
		openTrades: [...s.openTrades, trade]
	} };
}
function merge(base, ...patches) {
	return patches.reduce((acc, patch) => patch ? {
		...acc,
		...patch
	} : acc, base);
}
var nextSignal = /* @__PURE__ */ new Map();
var copyBroke = false;
function settle(s, now) {
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
	const closed = [];
	for (const trade of due) {
		const closePrice = market.price(trade.assetId);
		const up = closePrice > trade.openPrice;
		const down = closePrice < trade.openPrice;
		const win = trade.side === "call" && up || trade.side === "put" && down;
		const tie = !up && !down;
		const result = tie ? "tie" : win ? "win" : "loss";
		const pnl = tie ? 0 : win ? money(trade.stake * trade.payout) : -trade.stake;
		const credit = tie ? trade.stake : win ? money(trade.stake * (1 + trade.payout)) : 0;
		balances[trade.account] = money(balances[trade.account] + credit);
		const row = {
			...trade,
			closePrice,
			closedAt: now,
			result,
			pnl
		};
		closed.push(row);
		if (trade.source === "bot") {
			botPnl = money(botPnl + pnl);
			if (win) botWins += 1;
			else if (!tie) botLosses += 1;
			const goal = s.goalMode === "brl" ? s.goalBrl : s.botBase * (s.goalPct / 100);
			if (botOn && goal > 0 && botPnl >= goal) {
				botOn = false;
				botNote = "Meta atingida nesta sessão. O robô parou.";
				cooldownUntil = now + 15e3;
			}
		}
		const verb = result === "win" ? "Ganho" : result === "loss" ? "Perda" : "Empate";
		const tone = result === "win" ? "up" : result === "loss" ? "down" : "muted";
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
		notices
	};
}
function considerBot(s, now) {
	if (!s.botOn) return null;
	if (now < s.cooldownUntil) return null;
	if (s.openTrades.some((t) => t.source === "bot")) return null;
	if (now < s.nextBotAt) return null;
	const slope = market.slope(s.assetId, 14);
	if (Math.abs(slope) < 25e-6 && Math.random() < .7) return { nextBotAt: now + 1200 };
	const side = slope >= 0 ? "call" : "put";
	const placed = applyPlace(s, {
		assetId: s.assetId,
		side,
		stake: s.botStake,
		expiryMs: s.expiryMs,
		source: "bot",
		now
	});
	if (placed.error) return {
		botOn: false,
		botNote: placed.error,
		cooldownUntil: now + 8e3,
		notices: notice("Robô", placed.error, "gold", s.notices)
	};
	return {
		...placed.patch,
		nextBotAt: now + s.expiryMs + 1400
	};
}
function considerCopy(s, now) {
	let patch = null;
	let working = s;
	for (const trader of TRADERS) {
		let dueAt = nextSignal.get(trader.id) ?? 0;
		if (!dueAt) {
			nextSignal.set(trader.id, now + 4e3 + Math.random() * trader.everyMs);
			continue;
		}
		if (now < dueAt) continue;
		const assetId = trader.assets[Math.floor(Math.random() * trader.assets.length)] ?? trader.assets[0];
		const slope = market.slope(assetId, 16);
		const side = sideFrom(trader.style, slope);
		nextSignal.set(trader.id, now + trader.everyMs + Math.random() * 6e3);
		if (!side) continue;
		const price = market.price(assetId);
		market.pushSignal({
			id: uid(),
			traderId: trader.id,
			assetId,
			side,
			at: now,
			price
		});
		if (s.following !== trader.id) continue;
		if (working.openTrades.some((t) => t.source === "copy" && t.traderId === trader.id)) continue;
		const placed = applyPlace(working, {
			assetId,
			side,
			stake: working.copyStake,
			expiryMs: 2e4,
			source: "copy",
			traderId: trader.id,
			now
		});
		if (placed.error) {
			if (!copyBroke) {
				copyBroke = true;
				patch = {
					...patch ?? {},
					notices: notice("Copy", `${trader.name}: ${placed.error}`, "gold", working.notices)
				};
			}
			continue;
		}
		copyBroke = false;
		working = merge(working, placed.patch);
		patch = {
			...patch ?? {},
			...placed.patch,
			notices: working.notices
		};
	}
	return patch;
}
function engineTick() {
	market.step();
	const now = Date.now();
	let current = useDesk.getState();
	const settled = settle(current, now);
	if (settled) current = merge(current, settled);
	const botPatch = considerBot(current, now);
	if (botPatch) current = merge(current, botPatch);
	const copyPatch = considerCopy(current, now);
	if (copyPatch) current = merge(current, copyPatch);
	if (settled || botPatch || copyPatch) useDesk.setState({
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
		nextBotAt: current.nextBotAt
	});
	market.emit();
}
var timer = null;
function startEngine() {
	if (timer) return;
	market.bootstrap();
	timer = setInterval(engineTick, 200);
	market.emit();
}
function stopEngine() {
	if (!timer) return;
	clearInterval(timer);
	timer = null;
}
var useDesk = create()(persist((set, get) => ({
	...initial,
	setView: (view) => set({ view }),
	setAccount: (account) => {
		const s = get();
		if (s.account === account) return;
		set({
			account,
			botOn: false,
			botNote: s.botOn ? "Robô pausado ao trocar de conta." : s.botNote,
			cooldownUntil: s.botOn ? Date.now() + 4e3 : s.cooldownUntil
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
		const value = money(Math.min(1e5, n));
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
		if (!((s.goalMode === "brl" ? s.goalBrl : s.goalPct) > 0)) {
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
			botNote: ""
		});
	},
	stopBot: () => {
		set({
			botOn: false,
			cooldownUntil: Date.now() + 8e3,
			botNote: "Robô desligado."
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
			now: Date.now()
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
			balances: {
				...s.balances,
				[s.account]: money(s.balances[s.account] + 500)
			},
			notices: notice("Bônus de simulação", "R$ 500 virtuais creditados nesta conta.", "gold", s.notices)
		});
	},
	reset: () => {
		set({
			balances: {
				demo: 1e4,
				treino: 1e3
			},
			openTrades: [],
			history: [],
			botOn: false,
			botWins: 0,
			botLosses: 0,
			botPnl: 0,
			botNote: "",
			following: null,
			bonusClaimed: false,
			notices: notice("Reinício", "Saldos de simulação restaurados.", "muted", [])
		});
	},
	ensurePromo: () => {
		if (get().promoUntil > 0) return;
		set({ promoUntil: Date.now() + 2592e6 });
	}
}), {
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
		promoUntil: s.promoUntil
	})
}));
function goalAmount(s) {
	return s.goalMode === "brl" ? s.goalBrl : money(s.botBase * (s.goalPct / 100));
}
var EXPIRY_LABEL = {
	15e3: "15s",
	3e4: "30s",
	6e4: "1m",
	3e5: "5m"
};
function Sala() {
	useMarketVersion();
	const assetId = useDesk((s) => s.assetId);
	const setAsset = useDesk((s) => s.setAsset);
	const stake = useDesk((s) => s.stake);
	const setStake = useDesk((s) => s.setStake);
	const expiryMs = useDesk((s) => s.expiryMs);
	const setExpiry = useDesk((s) => s.setExpiry);
	const manual = useDesk((s) => s.manual);
	const openTrades = useDesk((s) => s.openTrades);
	const live = market.get(assetId);
	const change = live.dayOpen ? (live.price - live.dayOpen) / live.dayOpen * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3 overflow-auto p-3 xl:flex-row xl:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex min-h-80 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-panel xl:min-h-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-end justify-between gap-3 border-b border-line px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs tracking-widest text-muted uppercase",
							children: live.def.kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl leading-none font-semibold",
							children: live.def.symbol
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: live.def.name
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-3xl leading-none font-semibold tabular-nums",
							"data-testid": "price",
							children: px(live.price, live.def.digits)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: change >= 0 ? "text-sm text-up" : "text-sm text-down",
							children: pct(change)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto border-b border-line px-3 py-2",
					children: market.list().map((item) => {
						const on = item.def.id === assetId;
						const delta = item.dayOpen ? (item.price - item.dayOpen) / item.dayOpen * 100 : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAsset(item.def.id),
							className: on ? "shrink-0 rounded-md border border-gold bg-gold-dim px-3 py-2 text-left" : "shrink-0 rounded-md border border-line bg-panel-2 px-3 py-2 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-sm leading-none font-semibold",
								children: item.def.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: delta >= 0 ? "text-xs text-up" : "text-xs text-down",
								children: pct(delta, 2)
							})]
						}, item.def.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-56 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
						assetId,
						trades: openTrades
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex w-full shrink-0 flex-col gap-3 xl:w-96 xl:overflow-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
				stake,
				setStake,
				expiryMs,
				setExpiry,
				payout: live.def.payout,
				onSide: manual,
				openTrades: openTrades.filter((t) => t.source === "manual" || t.assetId === assetId)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotPanel, {})]
		})]
	});
}
function Ticket({ stake, setStake, expiryMs, setExpiry, payout, onSide, openTrades }) {
	useMarketVersion();
	const profit = stake * payout;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-panel p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold tracking-wide",
					children: "ORDEM"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted",
					children: [
						"Pagamento ",
						Math.round(payout * 100),
						"%"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-2 block text-xs tracking-widest text-muted uppercase",
				htmlFor: "stake",
				children: "Valor virtual"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "stake",
				"data-testid": "stake",
				inputMode: "decimal",
				type: "number",
				min: 5,
				step: 5,
				value: stake || "",
				onChange: (event) => setStake(Number(event.target.value)),
				className: "mb-3 h-12 w-full rounded-md border border-line bg-bg px-3 font-display text-2xl font-semibold text-fg outline-none focus:border-up"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 grid grid-cols-4 gap-2",
				children: EXPIRIES.map((ms) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setExpiry(ms),
					className: expiryMs === ms ? "h-11 rounded-md bg-fg font-display text-base font-bold text-bg" : "h-11 rounded-md border border-line font-display text-base font-semibold text-muted",
					children: EXPIRY_LABEL[ms]
				}, ms))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-sm text-muted",
				children: [
					"Se acertar, ",
					signedBrl(profit),
					". Abaixo de 100% de pagamento, a expectativa no longo prazo é negativa."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "call",
					onClick: () => onSide("call"),
					className: "h-12 rounded-md bg-up font-display text-xl font-bold tracking-wide text-ink",
					children: "ALTA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "put",
					onClick: () => onSide("put"),
					className: "h-12 rounded-md bg-down font-display text-xl font-bold tracking-wide text-fg",
					children: "BAIXA"
				})]
			}),
			openTrades.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: openTrades.slice(0, 4).map((trade) => {
					const left = trade.openAt + trade.expiryMs - Date.now();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-md bg-panel-2 px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: trade.side === "call" ? "text-up" : "text-down",
							children: [
								trade.symbol,
								" ",
								trade.side === "call" ? "alta" : "baixa"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-base tabular-nums",
							children: mmss(left)
						})]
					}, trade.id);
				})
			})
		]
	});
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
	const target = goalAmount({
		goalMode,
		goalBrl,
		goalPct,
		botBase: useDesk((s) => s.botBase)
	});
	const progress = target > 0 ? Math.max(0, Math.min(100, botPnl / target * 100)) : 0;
	const now = Date.now();
	const wobble = botOn && !open ? Math.sin(now / 380) * 7 : 0;
	const needle = open ? open.side === "call" ? 78 : 22 : botOn ? progress + wobble : 4;
	const color = open ? open.side === "call" ? "up" : "down" : botOn ? "gold" : "muted";
	const caption = open ? open.side === "call" ? "ALTA" : "BAIXA" : botOn ? "ANALISANDO" : "PARADO";
	const symbol = market.get(assetId).def.symbol;
	const wait = botOn ? Math.max(0, nextBotAt - now) : Math.max(0, cooldownUntil - now);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-panel p-3",
		"data-testid": "bot",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold tracking-wide",
					children: "ORION"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "inline-block size-2 rounded-full bg-up" }),
						"Livro sintético · ",
						symbol
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {
				percent: needle,
				caption,
				color
			}),
			!botOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs tracking-widest text-muted uppercase",
							children: ["Valor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"data-testid": "bot-stake",
								inputMode: "decimal",
								type: "number",
								min: 5,
								value: botStake || "",
								onChange: (event) => setBotStake(Number(event.target.value)),
								className: "mt-1 h-11 w-full rounded-md border border-line bg-bg px-2 font-display text-xl font-semibold text-fg outline-none focus:border-up"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs tracking-widest text-muted uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center justify-between",
								children: ["Meta", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex gap-1 normal-case",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
										on: goalMode === "pct",
										onClick: () => setGoalMode("pct"),
										children: "%"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
										on: goalMode === "brl",
										onClick: () => setGoalMode("brl"),
										children: "R$"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"data-testid": "bot-goal",
								inputMode: "decimal",
								type: "number",
								min: 1,
								value: goalMode === "brl" ? goalBrl || "" : goalPct || "",
								onChange: (event) => setGoal(Number(event.target.value)),
								className: "mt-1 h-11 w-full rounded-md border border-line bg-bg px-2 font-display text-xl font-semibold text-fg outline-none focus:border-up"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": "bot-start",
						onClick: startBot,
						className: "h-12 rounded-md bg-up font-display text-xl font-bold tracking-widest text-ink",
						children: "INICIAR"
					}),
					note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-gold",
						children: note
					}),
					wait > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-center text-sm text-muted",
						children: ["Intervalo ", mmss(wait)]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs tracking-widest text-muted uppercase",
							children: "Acerto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-2xl font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-up",
									children: wins
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1 text-faint",
									children: "×"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-down",
									children: losses
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: open ? "No ar" : "Próxima",
						value: open ? mmss(open.openAt + open.expiryMs - now) : mmss(wait)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 overflow-hidden rounded-full bg-panel-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-gold",
							style: { width: `${open ? timePct(open) : 12}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Resultado",
						value: signedBrl(botPnl),
						tone: botPnl >= 0 ? "up" : "down"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Meta",
						value: goalMode === "brl" ? brl(goalBrl) : `${goalPct}% · ${brl(target)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 overflow-hidden rounded-full bg-panel-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-up",
							style: { width: `${progress}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": "bot-stop",
						onClick: stopBot,
						className: "mt-1 h-12 rounded-md bg-down font-display text-xl font-bold tracking-widest text-fg",
						children: "DESLIGAR"
					}),
					note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-gold",
						children: note
					})
				]
			})
		]
	});
}
function timePct(trade) {
	const gone = Date.now() - trade.openAt;
	return Math.max(4, Math.min(100, gone / trade.expiryMs * 100));
}
function Row({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs tracking-widest text-muted uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-display text-lg font-semibold tabular-nums ${tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg"}`,
			children: value
		})]
	});
}
function Unit({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: on ? "rounded bg-up px-2 py-1 font-display text-xs font-bold text-ink" : "rounded bg-panel-2 px-2 py-1 font-display text-xs font-bold text-muted",
		children
	});
}
var KINDS = [
	"Todos",
	"Forex",
	"Cripto",
	"Índice",
	"Commodity",
	"Ação"
];
function Ativos() {
	useMarketVersion();
	const assetId = useDesk((s) => s.assetId);
	const setAsset = useDesk((s) => s.setAsset);
	const setView = useDesk((s) => s.setView);
	const [kind, setKind] = (0, import_react.useState)("Todos");
	const [q, setQ] = (0, import_react.useState)("");
	const query = q.trim().toLowerCase();
	const rows = market.list().filter((item) => {
		if (kind !== "Todos" && item.def.kind !== kind) return false;
		if (!query) return true;
		return item.def.symbol.toLowerCase().includes(query) || item.def.name.toLowerCase().includes(query);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3 overflow-auto p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Ativos"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Preços gerados neste aparelho. Nenhum feed de corretora."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (event) => setQ(event.target.value),
				placeholder: "Buscar par ou nome",
				className: "h-12 rounded-md border border-line bg-panel px-3 text-fg outline-none placeholder:text-faint focus:border-gold"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto",
				children: KINDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setKind(item),
					className: kind === item ? "h-10 shrink-0 rounded-full bg-fg px-4 text-sm font-medium text-bg" : "h-10 shrink-0 rounded-full border border-line px-4 text-sm text-muted",
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: rows.map((item) => {
					const delta = item.dayOpen ? (item.price - item.dayOpen) / item.dayOpen * 100 : 0;
					const on = item.def.id === assetId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setAsset(item.def.id);
							setView("sala");
						},
						className: on ? "flex w-full items-center gap-3 rounded-lg border border-gold bg-panel px-3 py-3 text-left" : "flex w-full items-center gap-3 rounded-lg border border-line bg-panel px-3 py-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-xl leading-none font-semibold",
									children: item.def.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-sm text-muted",
									children: [
										item.def.name,
										" · ",
										item.def.kind
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg font-semibold tabular-nums",
									children: px(item.price, item.def.digits)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: delta >= 0 ? "text-sm text-up" : "text-sm text-down",
									children: pct(delta)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-14 text-right text-sm text-gold",
								children: [Math.round(item.def.payout * 100), "%"]
							})
						]
					}) }, item.def.id);
				})
			})
		]
	});
}
function CopyView() {
	useMarketVersion();
	const following = useDesk((s) => s.following);
	const setFollowing = useDesk((s) => s.setFollowing);
	const copyStake = useDesk((s) => s.copyStake);
	const setCopyStake = useDesk((s) => s.setCopyStake);
	const history = useDesk((s) => s.history);
	const alias = useDesk((s) => s.hideName ? "Anônimo" : s.alias || "Visitante");
	const active = traderById(following ?? void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3 overflow-auto p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Copy"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [alias, " segue um estilo no livro sintético. O valor sai da conta virtual aberta."]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "rounded-lg border border-line bg-panel p-3 text-sm text-muted",
				children: [
					"Valor por sinal",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"data-testid": "copy-stake",
						type: "number",
						min: 5,
						value: copyStake || "",
						onChange: (event) => setCopyStake(Number(event.target.value)),
						className: "mt-2 h-12 w-full rounded-md border border-line bg-bg px-3 font-display text-2xl font-semibold text-fg outline-none focus:border-gold"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-2 block",
						children: ["Expiração dos sinais copiados: 20 segundos. ", active ? `Seguindo ${active.name}.` : "Ninguém em cópia."]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2 md:grid-cols-2",
				children: TRADERS.map((trader) => {
					const mine = history.filter((row) => row.traderId === trader.id);
					const pnl = mine.reduce((sum, row) => sum + row.pnl, 0);
					const wins = mine.filter((row) => row.result === "win").length;
					const on = following === trader.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-line bg-panel p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl leading-none font-semibold",
									children: trader.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted",
									children: [
										trader.styleLabel,
										" · ",
										trader.market
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-line px-2 py-1 text-xs text-muted",
									children: trader.risk
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-lg",
								children: ["Sessão ", mine.length === 0 ? "sem operações" : `${wins}/${mine.length} · ${signedBrl(pnl)}`]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-testid": `follow-${trader.id}`,
								onClick: () => setFollowing(on ? null : trader.id),
								className: on ? "mt-3 h-11 w-full rounded-md bg-down font-display text-lg font-bold text-fg" : "mt-3 h-11 w-full rounded-md bg-up font-display text-lg font-bold text-ink",
								children: on ? "PARAR CÓPIA" : "COPIAR"
							})
						]
					}, trader.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Sinais da sala"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 flex flex-col gap-2",
					children: [market.signals.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Os sinais aparecem conforme o livro anda."
					}), market.signals.slice(0, 8).map((signal) => {
						const trader = traderById(signal.traderId);
						const asset = market.get(signal.assetId).def;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: trader?.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: signal.side === "call" ? "text-up" : "text-down",
								children: [
									asset.symbol,
									" ",
									signal.side === "call" ? "alta" : "baixa"
								]
							})]
						}, signal.id);
					})]
				})]
			})
		]
	});
}
var FILTERS = [
	{
		id: "todas",
		label: "Todas"
	},
	{
		id: "manual",
		label: "Manuais"
	},
	{
		id: "bot",
		label: "Robô"
	},
	{
		id: "copy",
		label: "Copy"
	}
];
function Ops() {
	useMarketVersion();
	const openTrades = useDesk((s) => s.openTrades);
	const history = useDesk((s) => s.history);
	const [filter, setFilter] = (0, import_react.useState)("todas");
	const match = (source) => filter === "todas" || source === filter;
	const open = openTrades.filter((trade) => match(trade.source));
	const closed = history.filter((trade) => match(trade.source));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3 overflow-auto p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Operações"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Abertas e encerradas nesta sessão de simulação."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto",
				children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(item.id),
					className: filter === item.id ? "h-10 shrink-0 rounded-full bg-fg px-4 text-sm font-medium text-bg" : "h-10 shrink-0 rounded-full border border-line px-4 text-sm text-muted",
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Em aberto"
					}),
					open.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Nenhuma operação aberta neste filtro."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-col gap-2",
						children: open.map((trade) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: trade.side === "call" ? "text-up" : "text-down",
									children: trade.side === "call" ? "Alta" : "Baixa"
								}),
								" ",
								trade.symbol,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [" · ", label(trade.source)]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base tabular-nums",
								children: mmss(trade.openAt + trade.expiryMs - Date.now())
							})]
						}, trade.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Histórico"
					}),
					closed.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Quando uma ordem expirar, ela aparece aqui."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-col",
						children: closed.map((trade) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 border-b border-line py-3 text-sm last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								trade.symbol,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: trade.side === "call" ? "text-up" : "text-down",
									children: trade.side === "call" ? "alta" : "baixa"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted",
								children: [
									label(trade.source),
									" · ",
									px(trade.openPrice, trade.digits),
									" → ",
									px(trade.closePrice, trade.digits)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: trade.pnl > 0 ? "font-display text-lg text-up" : trade.pnl < 0 ? "font-display text-lg text-down" : "font-display text-lg text-muted",
								children: signedBrl(trade.pnl)
							})]
						}, trade.id))
					})
				]
			})
		]
	});
}
function label(source) {
	if (source === "bot") return "Robô";
	if (source === "copy") return "Copy";
	return "Manual";
}
function Perfil() {
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
	const prazo = promoUntil > 0 ? new Date(promoUntil).toLocaleDateString("pt-BR", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}) : "nesta temporada";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3 overflow-auto p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Perfil"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Duas contas virtuais. Não há depósito, saque nem ordem real."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Contas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountCard, {
						id: "demo",
						current: account,
						balance: balances.demo,
						title: "Demo",
						onPick: setAccount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountCard, {
						id: "treino",
						current: account,
						balance: balances.treino,
						title: "Treino",
						onPick: setAccount
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"data-testid": "bonus",
				disabled: bonusClaimed,
				onClick: claimBonus,
				className: "flex items-center justify-between gap-3 rounded-lg bg-gold-dim px-4 py-4 text-left disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-display text-xl font-semibold text-gold",
					children: "Bônus de simulação"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-muted",
					children: [
						"+",
						brl(500),
						" virtuais · até ",
						prazo
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg font-bold text-gold",
					children: bonusClaimed ? "USADO" : "RESGATAR"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Identidade na sala"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-2 block text-sm text-muted",
						htmlFor: "alias",
						children: ["Apelido", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "alias",
							value: alias,
							onChange: (event) => setAlias(event.target.value),
							className: "mt-1 h-12 w-full rounded-md border border-line bg-bg px-3 text-fg outline-none focus:border-gold"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: hideName,
						onClick: () => setHideName(!hideName),
						label: "Ocultar apelido no copy"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Avisos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: notify,
						onClick: () => setNotify(!notify),
						label: "Avisos de resultado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: sound,
						onClick: () => setSound(!sound),
						label: "Som curto ao fechar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (typeof Notification === "undefined") return;
							Notification.requestPermission().then((permission) => {
								if (permission === "granted") new Notification("Orion Desk", { body: "Você recebe o resultado das operações neste aparelho." });
							});
						},
						className: "mt-2 h-11 rounded-md border border-line px-4 text-sm",
						children: "Permitir avisos do navegador"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 flex flex-col gap-2",
						children: [notices.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "Nenhum aviso ainda."
						}), notices.slice(0, 6).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: item.tone === "up" ? "text-up" : item.tone === "down" ? "text-down" : item.tone === "gold" ? "text-gold" : "text-muted",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" · ", item.body]
							})]
						}, item.id))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-3 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold text-fg",
						children: "O que isto é"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Orion Desk é um simulador de mesa: gráfico, alta/baixa, robô e copy rodam só no seu navegador, com saldo fictício. Não é corretora, não executa ordem em mercado nenhum e não promete ganho. O pagamento de cada ativo fica abaixo de 100%, então uma estratégia sem vantagem perde no agregado."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: reset,
						className: "mt-3 h-11 rounded-md border border-line px-4 text-fg",
						children: "Restaurar saldos"
					})
				]
			})
		]
	});
}
function AccountCard({ id, current, balance, title, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onPick(id),
		className: current === id ? "rounded-md border border-up bg-up-dim px-3 py-3 text-left" : "rounded-md border border-line px-3 py-3 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs tracking-widest text-muted uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-xl font-semibold tabular-nums",
			children: brl(balance)
		})]
	});
}
function Toggle({ on, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "mt-3 flex h-12 w-full items-center justify-between gap-3 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: on ? "rounded-full bg-up px-3 py-1 text-sm font-semibold text-ink" : "rounded-full bg-panel-2 px-3 py-1 text-sm text-muted",
			children: on ? "Ligado" : "Desligado"
		})]
	});
}
var NAV = [
	{
		id: "sala",
		label: "Sala",
		icon: ChartCandlestick
	},
	{
		id: "ativos",
		label: "Ativos",
		icon: Layers
	},
	{
		id: "copy",
		label: "Copy",
		icon: Copy
	},
	{
		id: "ops",
		label: "Ops",
		icon: ScrollText
	},
	{
		id: "perfil",
		label: "Perfil",
		icon: UserRound
	}
];
function DeskApp() {
	const [splash, setSplash] = (0, import_react.useState)(true);
	const view = useDesk((s) => s.view);
	(0, import_react.useEffect)(() => {
		useDesk.persist.rehydrate();
		useDesk.getState().ensurePromo();
		startEngine();
		const timer = window.setTimeout(() => setSplash(false), 900);
		return () => {
			window.clearTimeout(timer);
			stopEngine();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-h-0 flex-1",
				children: [
					view === "sala" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sala, {}),
					view === "ativos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ativos, {}),
					view === "copy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyView, {}),
					view === "ops" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ops, {}),
					view === "perfil" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perfil, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toasts, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "grid grid-cols-5 border-t border-line bg-panel",
				children: NAV.map((item) => {
					const Icon = item.icon;
					const on = view === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": `nav-${item.id}`,
						onClick: () => useDesk.getState().setView(item.id),
						className: on ? "flex h-16 flex-col items-center justify-center gap-1 text-gold" : "flex h-16 flex-col items-center justify-center gap-1 text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs",
							children: item.label
						})]
					}, item.id);
				})
			}),
			splash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-center justify-center bg-bg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 text-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-16" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-4xl font-semibold tracking-widest text-fg",
							children: "ORION"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs tracking-widest text-muted",
							children: "DESK · SIMULADOR"
						})
					]
				})
			})
		]
	});
}
function TopBar() {
	const version = useMarketVersion();
	const account = useDesk((s) => s.account);
	const balance = useDesk((s) => s.balances[s.account]);
	const setAccount = useDesk((s) => s.setAccount);
	const [time, setTime] = (0, import_react.useState)("—");
	(0, import_react.useEffect)(() => {
		setTime(clock());
	}, [version]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center gap-3 border-b border-line bg-panel px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-7 shrink-0 text-gold" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-xl leading-none font-bold tracking-widest",
					children: "ORION"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs tracking-wide text-muted",
					children: "PAPEL"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs tracking-widest text-muted uppercase",
							children: account === "demo" ? "Demo" : "Treino"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-lg leading-none font-semibold tabular-nums",
							"data-testid": "balance",
							children: brl(balance)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setAccount(account === "demo" ? "treino" : "demo"),
						className: "h-11 rounded-md border border-line px-3 text-sm",
						children: "Trocar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden font-display text-sm tabular-nums text-muted sm:inline",
						children: time
					})
				]
			})
		]
	});
}
function Toasts() {
	useMarketVersion();
	const fresh = useDesk((s) => s.notices).filter((item) => Date.now() - item.at < 4200).slice(0, 3);
	if (!fresh.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-x-0 top-16 z-30 flex flex-col items-center gap-2 px-3",
		children: fresh.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-lg border border-gold bg-panel px-4 py-3 text-center text-sm text-gold shadow-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-fg",
				children: [" · ", item.body]
			})]
		}, item.id))
	});
}
var SplitComponent = DeskApp;
//#endregion
export { SplitComponent as component };
