import React, { useMemo, useState } from "react";

let sharedContext = null;

const basePresets = [
  { id: "msg-soft", group: "Message", name: "Soft alien notification", description: "轻、短、带一点异世界感，不像手机默认铃声。" },
  { id: "msg-glass", group: "Message", name: "Glass pulse", description: "更冷一点，像屏幕自己亮起。" },
  { id: "msg-static", group: "Message", name: "Static text ping", description: "短信出现前的一小段静电感。" },
  { id: "dice-wood", group: "Dice", name: "Soft dice taps", description: "克制的骰子轻敲，不做电玩城按钮感。" },
  { id: "dice-digital", group: "Dice", name: "Digital roll", description: "偏网页/科幻一点，但比刚刚的 beep 柔和。" },
  { id: "dice-hollow", group: "Dice", name: "Hollow table roll", description: "低一点、空一点，像骰子落在旧桌面。" },
  { id: "door-low", group: "Door", name: "Low threshold hum", description: "拉门时的低频空气震动。" },
  { id: "door-wood", group: "Door", name: "Old wood breath", description: "不像恐怖门，更像旧木头醒过来。" },
  { id: "door-portal", group: "Door", name: "Golden crack opens", description: "门缝打开、金光溢出的短音。" },
  { id: "success-soft", group: "Result", name: "Quiet success", description: "判定成功，但不游戏化。" },
  { id: "fail-soft", group: "Result", name: "Quiet failure", description: "失败提示，压低但不吓人。" },
  { id: "text-begin", group: "Text", name: "Message begins typing", description: "短信开始打字前的一下，很轻。" },
];

function makeSeed() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bucket = new Uint32Array(1);
    crypto.getRandomValues(bucket);
    return bucket[0];
  }
  return Math.floor(Math.random() * 4294967295);
}

function createTake(base, seed = makeSeed()) {
  return { ...base, seed, take: String(seed).slice(-5).padStart(5, "0") };
}

function randomFromSeed(seed) {
  let value = seed >>> 0;
  return function next() {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedContext) sharedContext = new AudioContextClass();
  if (sharedContext.state === "suspended") sharedContext.resume();
  return sharedContext;
}

function makeGain(context, volume, start, attack, release, duration) {
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration + release);
  return gain;
}

function tone(context, destination, options) {
  const start = context.currentTime + (options.delay || 0);
  const oscillator = context.createOscillator();
  const gain = makeGain(context, options.volume || 0.03, start, options.attack || 0.02, options.release || 0.08, options.duration || 0.2);
  oscillator.type = options.type || "sine";
  oscillator.frequency.setValueAtTime(Math.max(30, options.frequency), start);
  if (options.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, options.endFrequency), start + options.duration);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(start);
  oscillator.stop(start + options.duration + (options.release || 0.08) + 0.03);
}

function noise(context, destination, options) {
  const duration = options.duration || 0.2;
  const start = context.currentTime + (options.delay || 0);
  const buffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * duration)), context.sampleRate);
  const data = buffer.getChannelData(0);
  const rand = options.rand || Math.random;
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (rand() * 2 - 1) * Math.pow(1 - index / data.length, options.decay || 1.4);
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = makeGain(context, options.volume || 0.02, start, options.attack || 0.01, options.release || 0.08, duration);
  source.buffer = buffer;
  filter.type = options.filterType || "bandpass";
  filter.frequency.setValueAtTime(options.frequency || 800, start);
  filter.Q.setValueAtTime(options.q || 1.2, start);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(start);
  source.stop(start + duration + 0.03);
}

function buildOutput(context, masterVolume) {
  const compressor = context.createDynamicsCompressor();
  const master = context.createGain();
  compressor.threshold.setValueAtTime(-30, context.currentTime);
  compressor.knee.setValueAtTime(20, context.currentTime);
  compressor.ratio.setValueAtTime(5, context.currentTime);
  compressor.attack.setValueAtTime(0.006, context.currentTime);
  compressor.release.setValueAtTime(0.2, context.currentTime);
  master.gain.setValueAtTime(masterVolume, context.currentTime);
  compressor.connect(master);
  master.connect(context.destination);
  return compressor;
}

function playPreset(preset, masterVolume) {
  const context = getAudioContext();
  if (!context) return;
  const rand = randomFromSeed(preset.seed);
  const out = buildOutput(context, masterVolume);
  const pitch = 0.42 + rand() * 1.45;
  const speed = 0.45 + rand() * 1.35;
  const bright = 0.25 + rand() * 2.1;
  const texture = 0.25 + rand() * 2.35;
  const spacing = 0.32 + rand() * 2.25;
  const sweep = 0.42 + rand() * 1.85;
  const typePool = ["sine", "triangle", "sawtooth", "square"];
  const softType = typePool[Math.floor(rand() * 2)];
  const roughType = typePool[Math.floor(rand() * typePool.length)];
  const f = (value) => Math.max(35, value * pitch);
  const d = (value) => Math.max(0.025, value * speed);
  const v = (value) => Math.max(0.002, value * bright);
  const q = (value) => Math.max(0.3, value * texture);
  const gap = (value) => value * spacing;
  const noiseRand = randomFromSeed(preset.seed ^ 0x9e3779b9);

  if (preset.id === "msg-soft") {
    tone(context, out, { frequency: f(520 + rand() * 240), endFrequency: f(700 + rand() * 360), duration: d(0.14 + rand() * 0.12), type: softType, volume: v(0.018), attack: 0.02, release: d(0.14) });
    tone(context, out, { frequency: f(1040 + rand() * 420), duration: d(0.06 + rand() * 0.08), type: "triangle", volume: v(0.007), delay: gap(0.055 + rand() * 0.055), attack: 0.014, release: d(0.11) });
    noise(context, out, { duration: d(0.08 + rand() * 0.12), frequency: f(1300 + rand() * 1600), volume: v(0.004), delay: gap(0.01), q: q(3.2), rand: noiseRand });
  }

  if (preset.id === "msg-glass") {
    tone(context, out, { frequency: f(720 + rand() * 320), duration: d(0.14 + rand() * 0.16), type: "triangle", volume: v(0.014), attack: 0.03, release: d(0.22) });
    tone(context, out, { frequency: f(1180 + rand() * 600), endFrequency: f(980 + rand() * 300), duration: d(0.1 + rand() * 0.12), type: "sine", volume: v(0.008), delay: gap(0.06 + rand() * 0.08), attack: 0.018, release: d(0.16) });
    noise(context, out, { duration: d(0.05 + rand() * 0.08), frequency: f(2600 + rand() * 1400), volume: v(0.0025), delay: gap(0.12), q: q(6), rand: noiseRand });
  }

  if (preset.id === "msg-static") {
    noise(context, out, { duration: d(0.14 + rand() * 0.22), frequency: f(1500 + rand() * 2200), volume: v(0.011), q: q(4 + rand() * 4), decay: 1.4 + rand() * 1.8, rand: noiseRand });
    tone(context, out, { frequency: f(520 + rand() * 360), duration: d(0.06 + rand() * 0.08), type: softType, volume: v(0.01), delay: gap(0.09 + rand() * 0.1), attack: 0.012, release: d(0.12) });
  }

  if (preset.id === "dice-wood") {
    const count = 2 + Math.floor(rand() * 7);
    Array.from({ length: count }).forEach((_, index) => noise(context, out, { duration: d(0.035 + rand() * 0.055), frequency: f(150 + index * (45 + rand() * 70)), volume: v(0.022 - index * 0.0022), delay: gap(index * (0.025 + rand() * 0.085)), q: q(0.7 + rand()), decay: 2.2 + rand() * 2.6, filterType: "lowpass", rand: noiseRand }));
    tone(context, out, { frequency: f(75 + rand() * 80), duration: d(0.06 + rand() * 0.08), type: "sine", volume: v(0.006), delay: gap(0.18 + rand() * 0.1), attack: 0.012, release: d(0.1) });
  }

  if (preset.id === "dice-digital") {
    const count = 2 + Math.floor(rand() * 8);
    Array.from({ length: count }).forEach((_, index) => tone(context, out, { frequency: f(240 + rand() * 380), duration: d(0.025 + rand() * 0.045), type: roughType, volume: v(0.008), delay: gap(index * (0.018 + rand() * 0.09)), attack: 0.007, release: d(0.055) }));
    noise(context, out, { duration: d(0.08 + rand() * 0.14), frequency: f(900 + rand() * 1600), volume: v(0.0035), delay: gap(0.025), q: q(3.5), rand: noiseRand });
  }

  if (preset.id === "dice-hollow") {
    const count = 1 + Math.floor(rand() * 7);
    Array.from({ length: count }).forEach((_, index) => {
      const delay = gap(index * (0.035 + rand() * 0.14));
      noise(context, out, { duration: d(0.065 + rand() * 0.08), frequency: f(95 + index * (45 + rand() * 55)), volume: v(0.024 - index * 0.003), delay, q: q(0.6 + rand()), decay: 2 + rand() * 2.8, filterType: "lowpass", rand: noiseRand });
      tone(context, out, { frequency: f(60 + rand() * 75), duration: d(0.08 + rand() * 0.1), type: "sine", volume: v(0.006), delay: delay + 0.01, attack: 0.012, release: d(0.12) });
    });
  }

  if (preset.id === "door-low") {
    tone(context, out, { frequency: f(44 + rand() * 30), endFrequency: f((62 + rand() * 40) * sweep), duration: d(0.55 + rand() * 0.55), type: "sine", volume: v(0.026), attack: d(0.08), release: d(0.35) });
    tone(context, out, { frequency: f(90 + rand() * 70), endFrequency: f(128 + rand() * 120), duration: d(0.36 + rand() * 0.36), type: "triangle", volume: v(0.012), delay: gap(0.08), attack: d(0.08), release: d(0.28) });
    noise(context, out, { duration: d(0.28 + rand() * 0.4), frequency: f(220 + rand() * 420), volume: v(0.004), delay: gap(0.12), q: q(1.1), filterType: "lowpass", rand: noiseRand });
  }

  if (preset.id === "door-wood") {
    noise(context, out, { duration: d(0.22 + rand() * 0.3), frequency: f(220 + rand() * 320), volume: v(0.014), q: q(0.8), filterType: "lowpass", decay: 0.8 + rand() * 1.4, rand: noiseRand });
    tone(context, out, { frequency: f(68 + rand() * 48), duration: d(0.32 + rand() * 0.28), type: "sine", volume: v(0.01), delay: gap(0.05), attack: d(0.05), release: d(0.24) });
    noise(context, out, { duration: d(0.1 + rand() * 0.14), frequency: f(520 + rand() * 700), volume: v(0.0045), delay: gap(0.18 + rand() * 0.15), q: q(1.5 + rand() * 2), rand: noiseRand });
  }

  if (preset.id === "door-portal") {
    tone(context, out, { frequency: f(130 + rand() * 90), endFrequency: f(220 + rand() * 180), duration: d(0.4 + rand() * 0.4), type: "sine", volume: v(0.018), attack: d(0.08), release: d(0.24) });
    tone(context, out, { frequency: f(440 + rand() * 240), endFrequency: f(650 + rand() * 520), duration: d(0.18 + rand() * 0.26), type: "triangle", volume: v(0.007), delay: gap(0.12 + rand() * 0.1), attack: d(0.04), release: d(0.18) });
    noise(context, out, { duration: d(0.18 + rand() * 0.16), frequency: f(1600 + rand() * 1900), volume: v(0.0045), delay: gap(0.1), q: q(4 + rand() * 3), rand: noiseRand });
  }

  if (preset.id === "success-soft") {
    tone(context, out, { frequency: f(360 + rand() * 160), endFrequency: f(580 + rand() * 280), duration: d(0.13 + rand() * 0.14), type: softType, volume: v(0.014), attack: d(0.025), release: d(0.16) });
    tone(context, out, { frequency: f(720 + rand() * 360), duration: d(0.1 + rand() * 0.14), type: "triangle", volume: v(0.007), delay: gap(0.08 + rand() * 0.06), attack: d(0.025), release: d(0.16) });
  }

  if (preset.id === "fail-soft") {
    tone(context, out, { frequency: f(180 + rand() * 90), endFrequency: f(110 + rand() * 70), duration: d(0.2 + rand() * 0.22), type: "sine", volume: v(0.014), attack: d(0.035), release: d(0.2) });
    noise(context, out, { duration: d(0.1 + rand() * 0.14), frequency: f(280 + rand() * 420), volume: v(0.004), delay: gap(0.08 + rand() * 0.08), q: q(1.2), filterType: "lowpass", rand: noiseRand });
  }

  if (preset.id === "text-begin") {
    const count = 1 + Math.floor(rand() * 6);
    Array.from({ length: count }).forEach((_, index) => tone(context, out, { frequency: f(760 + rand() * 520), duration: d(0.025 + rand() * 0.04), type: "triangle", volume: v(0.006), delay: gap(index * (0.02 + rand() * 0.08)), attack: 0.006, release: d(0.06) }));
    noise(context, out, { duration: d(0.035 + rand() * 0.06), frequency: f(1600 + rand() * 1800), volume: v(0.0028), delay: gap(0.035), q: q(3 + rand() * 3), rand: noiseRand });
  }
}

function Pill({ children, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-amber-200/40 bg-amber-200/15 text-amber-50" : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"}`}>
      {children}
    </button>
  );
}

function SoundCard({ preset, selected, onPlay, onSelect }) {
  return (
    <div className={`rounded-3xl border p-4 transition ${selected ? "border-amber-200/40 bg-amber-200/[0.08]" : "border-white/10 bg-white/[0.035] hover:bg-white/[0.055]"}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{preset.group} · take {preset.take}</div>
          <h3 className="mt-1 text-base font-semibold text-slate-100">{preset.name}</h3>
        </div>
        <button type="button" onClick={onSelect} className={`rounded-full border px-3 py-1 text-xs transition ${selected ? "border-amber-200/30 bg-amber-200/15 text-amber-50" : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10"}`}>
          {selected ? "已锁定" : "选中"}
        </button>
      </div>
      <p className="min-h-[44px] text-sm leading-6 text-slate-400">{preset.description}</p>
      <button type="button" onClick={onPlay} className="mt-4 h-11 w-full rounded-2xl bg-sky-200 text-sm font-semibold text-slate-950 hover:bg-sky-100">
        Play
      </button>
    </div>
  );
}

export default function DWSoundEffectLab() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [presetBank, setPresetBank] = useState(() => basePresets.map((preset) => createTake(preset)));
  const [volume, setVolume] = useState(0.75);
  const groups = useMemo(() => ["All", ...Array.from(new Set(basePresets.map((preset) => preset.group)))], []);
  const filtered = filter === "All" ? presetBank : presetBank.filter((preset) => preset.group === filter);

  function toggleSelected(id) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function playSequence() {
    selected.forEach((id, index) => {
      const preset = presetBank.find((item) => item.id === id);
      if (preset) window.setTimeout(() => playPreset(preset, volume), index * 750);
    });
  }

  function refreshUnselected() {
    setPresetBank((current) => current.map((preset) => (selected.includes(preset.id) ? preset : createTake(basePresets.find((item) => item.id === preset.id) || preset))));
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.18),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(251,191,36,.14),transparent_26%),linear-gradient(135deg,#020617,#07111f_45%,#020617)] p-5 text-slate-100 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
          <div className="text-xs uppercase tracking-[0.28em] text-sky-100/60">DW audio workbench</div>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">Sound Effect Lab</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">先在这里试声音，不动主页面。选中会锁定当前 take，Refresh 会更大幅度重生成没锁定的声音。</p>
            </div>
            <div className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 md:w-72">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input type="range" min="0.1" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-full" />
            </div>
          </div>
        </header>

        <div className="mb-5 flex flex-wrap gap-2">
          {groups.map((group) => (
            <Pill key={group} active={filter === group} onClick={() => setFilter(group)}>
              {group}
            </Pill>
          ))}
        </div>

        <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold">Selected chain</div>
              <div className="mt-1 text-xs text-slate-500">{selected.length ? selected.map((id) => presetBank.find((preset) => preset.id === id)?.name).join(" → ") : "还没选。可以选几个组合起来听，比如 message → door → success。"}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={refreshUnselected} className="rounded-2xl border border-sky-200/20 bg-sky-200/10 px-4 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-200/15">
                Refresh unlocked
              </button>
              <button type="button" onClick={playSequence} disabled={!selected.length} className="rounded-2xl bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
                Play selected
              </button>
              <button type="button" onClick={() => setSelected([])} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
                Clear
              </button>
            </div>
          </div>
        </div>

        <main className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((preset) => (
            <SoundCard key={`${preset.id}-${preset.seed}`} preset={preset} selected={selected.includes(preset.id)} onSelect={() => toggleSelected(preset.id)} onPlay={() => playPreset(preset, volume)} />
          ))}
        </main>
      </div>
    </div>
  );
}
