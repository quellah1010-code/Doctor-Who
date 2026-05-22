import React, { useMemo, useState } from "react";

let sharedContext = null;

const presets = [
  {
    id: "msg-soft",
    group: "Message",
    name: "Soft alien notification",
    description: "轻、短、带一点异世界感，不像手机默认铃声。",
    color: "sky",
  },
  {
    id: "msg-glass",
    group: "Message",
    name: "Glass pulse",
    description: "更冷一点，像屏幕自己亮起。",
    color: "cyan",
  },
  {
    id: "msg-static",
    group: "Message",
    name: "Static text ping",
    description: "短信出现前的一小段静电感。",
    color: "violet",
  },
  {
    id: "dice-wood",
    group: "Dice",
    name: "Soft dice taps",
    description: "克制的骰子轻敲，不做电玩城按钮感。",
    color: "amber",
  },
  {
    id: "dice-digital",
    group: "Dice",
    name: "Digital roll",
    description: "偏网页/科幻一点，但比刚刚的 beep 柔和。",
    color: "fuchsia",
  },
  {
    id: "dice-hollow",
    group: "Dice",
    name: "Hollow table roll",
    description: "低一点、空一点，像骰子落在旧桌面。",
    color: "orange",
  },
  {
    id: "door-low",
    group: "Door",
    name: "Low threshold hum",
    description: "拉门时的低频空气震动。",
    color: "rose",
  },
  {
    id: "door-wood",
    group: "Door",
    name: "Old wood breath",
    description: "不像恐怖门，更像旧木头醒过来。",
    color: "emerald",
  },
  {
    id: "door-portal",
    group: "Door",
    name: "Golden crack opens",
    description: "门缝打开、金光溢出的短音。",
    color: "yellow",
  },
  {
    id: "success-soft",
    group: "Result",
    name: "Quiet success",
    description: "判定成功，但不游戏化。",
    color: "lime",
  },
  {
    id: "fail-soft",
    group: "Result",
    name: "Quiet failure",
    description: "失败提示，压低但不吓人。",
    color: "slate",
  },
  {
    id: "text-begin",
    group: "Text",
    name: "Message begins typing",
    description: "短信开始打字前的一下，很轻。",
    color: "indigo",
  },
];

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
  oscillator.frequency.setValueAtTime(options.frequency, start);
  if (options.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, start + options.duration);
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
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / data.length, options.decay || 1.4);
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
  compressor.threshold.setValueAtTime(-28, context.currentTime);
  compressor.knee.setValueAtTime(18, context.currentTime);
  compressor.ratio.setValueAtTime(4, context.currentTime);
  compressor.attack.setValueAtTime(0.008, context.currentTime);
  compressor.release.setValueAtTime(0.18, context.currentTime);
  master.gain.setValueAtTime(masterVolume, context.currentTime);
  compressor.connect(master);
  master.connect(context.destination);
  return compressor;
}

function playPreset(id, masterVolume) {
  const context = getAudioContext();
  if (!context) return;
  const out = buildOutput(context, masterVolume);

  if (id === "msg-soft") {
    tone(context, out, { frequency: 622, endFrequency: 740, duration: 0.16, type: "sine", volume: 0.025, attack: 0.025, release: 0.16 });
    tone(context, out, { frequency: 1244, duration: 0.08, type: "triangle", volume: 0.008, delay: 0.07, attack: 0.018, release: 0.12 });
    noise(context, out, { duration: 0.12, frequency: 1800, volume: 0.004, delay: 0.02, q: 4 });
  }

  if (id === "msg-glass") {
    tone(context, out, { frequency: 880, duration: 0.18, type: "triangle", volume: 0.018, attack: 0.035, release: 0.22 });
    tone(context, out, { frequency: 1320, duration: 0.12, type: "sine", volume: 0.01, delay: 0.08, attack: 0.02, release: 0.18 });
  }

  if (id === "msg-static") {
    noise(context, out, { duration: 0.18, frequency: 2200, volume: 0.014, q: 5, decay: 2 });
    tone(context, out, { frequency: 720, duration: 0.08, type: "sine", volume: 0.012, delay: 0.13, attack: 0.015, release: 0.14 });
  }

  if (id === "dice-wood") {
    [0, 0.07, 0.14, 0.23].forEach((delay, index) => noise(context, out, { duration: 0.05, frequency: 240 + index * 80, volume: 0.026 - index * 0.004, delay, q: 1.1, decay: 3, filterType: "lowpass" }));
    tone(context, out, { frequency: 120, duration: 0.09, type: "sine", volume: 0.008, delay: 0.22, attack: 0.015, release: 0.1 });
  }

  if (id === "dice-digital") {
    [392, 330, 466, 294].forEach((frequency, index) => tone(context, out, { frequency, duration: 0.045, type: "triangle", volume: 0.012, delay: index * 0.055, attack: 0.012, release: 0.07 }));
    noise(context, out, { duration: 0.16, frequency: 1500, volume: 0.005, delay: 0.03, q: 4 });
  }

  if (id === "dice-hollow") {
    [0, 0.08, 0.18].forEach((delay, index) => {
      noise(context, out, { duration: 0.075, frequency: 180 + index * 60, volume: 0.03 - index * 0.006, delay, q: 0.8, decay: 2.8, filterType: "lowpass" });
      tone(context, out, { frequency: 95 + index * 20, duration: 0.08, type: "sine", volume: 0.008, delay: delay + 0.01, attack: 0.01, release: 0.12 });
    });
  }

  if (id === "door-low") {
    tone(context, out, { frequency: 58, endFrequency: 72, duration: 0.85, type: "sine", volume: 0.035, attack: 0.12, release: 0.35 });
    tone(context, out, { frequency: 116, endFrequency: 144, duration: 0.6, type: "triangle", volume: 0.014, delay: 0.12, attack: 0.14, release: 0.3 });
    noise(context, out, { duration: 0.45, frequency: 420, volume: 0.006, delay: 0.18, q: 1.4, filterType: "lowpass" });
  }

  if (id === "door-wood") {
    noise(context, out, { duration: 0.32, frequency: 360, volume: 0.018, q: 0.9, filterType: "lowpass", decay: 1.1 });
    tone(context, out, { frequency: 92, duration: 0.48, type: "sine", volume: 0.012, delay: 0.08, attack: 0.08, release: 0.3 });
    noise(context, out, { duration: 0.18, frequency: 900, volume: 0.006, delay: 0.28, q: 2 });
  }

  if (id === "door-portal") {
    tone(context, out, { frequency: 174, endFrequency: 261, duration: 0.62, type: "sine", volume: 0.024, attack: 0.1, release: 0.28 });
    tone(context, out, { frequency: 523, endFrequency: 784, duration: 0.34, type: "triangle", volume: 0.01, delay: 0.18, attack: 0.06, release: 0.22 });
    noise(context, out, { duration: 0.26, frequency: 2600, volume: 0.006, delay: 0.15, q: 5 });
  }

  if (id === "success-soft") {
    tone(context, out, { frequency: 440, endFrequency: 660, duration: 0.18, type: "sine", volume: 0.018, attack: 0.03, release: 0.18 });
    tone(context, out, { frequency: 880, duration: 0.16, type: "triangle", volume: 0.009, delay: 0.12, attack: 0.04, release: 0.18 });
  }

  if (id === "fail-soft") {
    tone(context, out, { frequency: 220, endFrequency: 164, duration: 0.28, type: "sine", volume: 0.018, attack: 0.05, release: 0.22 });
    noise(context, out, { duration: 0.16, frequency: 500, volume: 0.006, delay: 0.12, q: 1.5, filterType: "lowpass" });
  }

  if (id === "text-begin") {
    tone(context, out, { frequency: 1046, duration: 0.045, type: "triangle", volume: 0.009, attack: 0.01, release: 0.08 });
    noise(context, out, { duration: 0.06, frequency: 2400, volume: 0.004, delay: 0.04, q: 4 });
  }
}

function Pill({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-amber-200/40 bg-amber-200/15 text-amber-50" : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"}`}
    >
      {children}
    </button>
  );
}

function SoundCard({ preset, selected, onPlay, onSelect }) {
  return (
    <div className={`rounded-3xl border p-4 transition ${selected ? "border-amber-200/40 bg-amber-200/[0.08]" : "border-white/10 bg-white/[0.035] hover:bg-white/[0.055]"}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{preset.group}</div>
          <h3 className="mt-1 text-base font-semibold text-slate-100">{preset.name}</h3>
        </div>
        <button type="button" onClick={onSelect} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">
          选中
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
  const [volume, setVolume] = useState(0.75);
  const groups = useMemo(() => ["All", ...Array.from(new Set(presets.map((preset) => preset.group)))], []);
  const filtered = filter === "All" ? presets : presets.filter((preset) => preset.group === filter);

  function toggleSelected(id) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function playSequence() {
    selected.forEach((id, index) => {
      window.setTimeout(() => playPreset(id, volume), index * 750);
    });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.18),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(251,191,36,.14),transparent_26%),linear-gradient(135deg,#020617,#07111f_45%,#020617)] p-5 text-slate-100 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
          <div className="text-xs uppercase tracking-[0.28em] text-sky-100/60">DW audio workbench</div>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">Sound Effect Lab</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">先在这里试声音，不动主页面。听到能用的，再把对应 preset 接回 Rose 那个交互里。</p>
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
              <div className="mt-1 text-xs text-slate-500">{selected.length ? selected.map((id) => presets.find((preset) => preset.id === id)?.name).join(" → ") : "还没选。可以选几个组合起来听，比如 message → door → success。"}</div>
            </div>
            <div className="flex gap-2">
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
            <SoundCard key={preset.id} preset={preset} selected={selected.includes(preset.id)} onSelect={() => toggleSelected(preset.id)} onPlay={() => playPreset(preset.id, volume)} />
          ))}
        </main>
      </div>
    </div>
  );
}
