import React, { useMemo, useState } from "react";

const maxAbilityTotal = 5;
const initialAbilities = { 感知: 0, 机智: 0, 胆量: 0, 冷静: 0 };

const nodes = {
  door: {
    title: "Rose 推开的那扇门",
    scene: "第 01 幕 · 打烊后的商场通道",
    location: "地下员工通道",
    tags: ["外面在下雨", "灯管嗡鸣", "不该出现的门", "无信号"],
    text: "走廊的灯闪了一下。尽头那面本该是水泥墙的地方，立着一扇蓝色木门。它太旧了，不像属于这座商场；它又太安静了，像一直在等某个人终于注意到它。",
    object: "门把手上方贴着一张白纸，上面写着：PULL TO OPEN。",
    hint: "你的手机自己亮了。一条没有发件人的未读短信，正静静躺在屏幕中央。",
    choices: [
      { label: "贴近门听一听", next: "listen", ability: "感知", dc: 12, icon: "◌" },
      { label: "查看手机", next: "phone", ability: "机智", dc: 10, icon: "▣" },
      { label: "拉开这扇门", next: "pull", ability: "胆量", dc: 14, icon: "▯" },
      { label: "后退一步", next: "stepback", ability: "冷静", dc: 9, icon: "←" },
    ],
    notes: ["先选择行动，再进入骰子判定", "玩家可手动输入 d20 点数，也可随机掷骰", "判定成功/失败会写入跑团记录并推进节点"],
  },
  listen: {
    title: "门也在听你",
    scene: "第 01A 幕 · 耳朵贴上木门",
    location: "同一条通道",
    tags: ["模糊人声", "旧电视静电", "温热的木头", "屏住呼吸"],
    text: "你把耳朵贴上蓝色木门。门后没有房间。那里有风声、机器声，还有一个女人的声音，从几十年的静电噪声里穿过来。她叫出了你的名字，语气像是忍了很久才终于开口。",
    object: "门的另一边回应了三下敲击。停顿。两下。再三下。",
    hint: "那个声音不像是在邀请你进去，更像是在确认：你是不是已经听见了。",
    choices: [
      { label: "敲回去", next: "pull", ability: "胆量", dc: 13, icon: "▯" },
      { label: "查看手机", next: "phone", ability: "机智", dc: 10, icon: "▣" },
      { label: "退回走廊", next: "door", ability: "冷静", dc: 8, icon: "←" },
    ],
    notes: ["成功时听见更完整的人声片段", "失败时走廊会用玩家自己的声音回应"],
  },
  phone: {
    title: "一条没有发件人的短信",
    scene: "第 01B 幕 · 手机屏幕",
    location: "地下员工通道",
    tags: ["冰冷玻璃", "屏幕微光", "没有发件人", "不可能的短信"],
    text: "屏幕在你没有触碰它的情况下亮起。无信号。无 Wi‑Fi。无发件人。短信框自己打开，字母一个个浮现出来，像时间另一端有个非常耐心的人正在打字。",
    object: "ROSE OPENED HERS. NOW IT’S YOUR TURN.",
    hint: "相机应用紧接着自己打开。在取景框里，那扇蓝门已经开了。",
    choices: [
      { label: "拍一张照", next: "stepback", ability: "机智", dc: 11, icon: "▣" },
      { label: "拉开这扇门", next: "pull", ability: "胆量", dc: 14, icon: "▯" },
      { label: "删除短信", next: "door", ability: "冷静", dc: 10, icon: "×" },
    ],
    notes: ["手机是玩家和时间裂缝之间的接口", "短信内容可以后续接入音效 Lab 里选出的提示音"],
  },
  pull: {
    title: "裂缝打开了",
    scene: "第 02 幕 · 门槛",
    location: "已经不完全是商场了",
    tags: ["金色光", "内部比外部更大", "机器呼吸", "无法原路返回"],
    text: "门把手比金属更冷，又比皮肤更温热。你向外一拉，门后没有普通房间，而是一片纵深。金色光铺过地面，带着雨水、灰尘、发热电线，以及某个等待太久的地方的气味。",
    object: "里面的墙壁上有一圈圈发光的圆形结构。一座控制台在深处低鸣，像某种努力假装成机器的动物。",
    hint: "你身后的走廊开始一盏灯、一盏灯地消失。",
    choices: [
      { label: "走进去", next: "door", ability: "胆量", dc: 14, icon: "→" },
      { label: "向里面喊话", next: "listen", ability: "感知", dc: 12, icon: "◌" },
      { label: "回头看", next: "stepback", ability: "冷静", dc: 11, icon: "←" },
    ],
    notes: ["第一版 demo 的高潮节点", "后续可接入门缝金光和低频门音效"],
  },
  stepback: {
    title: "你已经不能当作没看见了",
    scene: "第 01C 幕 · 尝试离开",
    location: "地下员工通道",
    tags: ["距离变错", "灯光重复", "商场地图改变", "轻微恐慌"],
    text: "你后退一步。很理智。很正常。很像一个人类该做的事。但走廊礼貌地拒绝结束。出口标识还在，只是现在它不再指向出口，而是指向那扇蓝门。",
    object: "地面上，你自己的影子向前伸长，在你之前碰到了门把手。",
    hint: "门还没有打开。但别的东西已经打开了。",
    choices: [
      { label: "跟着自己的影子", next: "pull", ability: "胆量", dc: 14, icon: "▯" },
      { label: "再听一次", next: "listen", ability: "感知", dc: 12, icon: "◌" },
      { label: "查看手机", next: "phone", ability: "机智", dc: 10, icon: "▣" },
    ],
    notes: ["拒绝分支", "不选择本身也会产生后果"],
  },
};

function rollD20() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const max = 4294967296 - (4294967296 % 20);
    const bucket = new Uint32Array(1);
    do crypto.getRandomValues(bucket); while (bucket[0] >= max);
    return (bucket[0] % 20) + 1;
  }
  return Math.floor(Math.random() * 20) + 1;
}

function Panel({ children, className = "" }) {
  return <div className={`rounded-3xl border border-white/10 bg-slate-950/55 shadow-2xl shadow-black/30 backdrop-blur ${className}`}>{children}</div>;
}

function DoorMotif({ nodeId }) {
  const isPull = nodeId === "pull";
  const isPhone = nodeId === "phone";
  const isShadow = nodeId === "stepback";
  return (
    <div className="relative mx-auto flex h-44 w-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20">
      {isPhone ? (
        <div className="h-36 w-22 rounded-[26px] border border-sky-100/20 bg-slate-950 p-2 shadow-[0_0_35px_rgba(56,189,248,.12)]">
          <div className="h-full rounded-2xl bg-gradient-to-b from-sky-950 to-slate-900 p-3 text-[8px] text-amber-100">NO SENDER</div>
        </div>
      ) : (
        <>
          <div className={`absolute h-40 w-4 rounded-full ${isPull ? "bg-amber-200/45 blur-2xl" : "bg-sky-300/25 blur-xl"}`} />
          <div className="absolute h-40 w-24 rounded-t-2xl border border-sky-200/15 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950" />
          <div className="absolute bottom-7 h-24 w-[3px] rounded-full bg-amber-200 shadow-[0_0_18px_rgba(251,191,36,.9)]" />
          {isShadow && <div className="absolute bottom-7 h-20 w-7 skew-x-[-18deg] rounded-full bg-slate-950" />}
        </>
      )}
    </div>
  );
}

function StartScreen({ abilities, setAbilities, onStart }) {
  const total = Object.values(abilities).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const overLimit = total > maxAbilityTotal;
  const [opened, setOpened] = useState(false);

  function updateAbility(name, value) {
    if (value === "") return setAbilities((current) => ({ ...current, [name]: "" }));
    const nextValue = Math.max(0, Math.min(3, Number.parseInt(value, 10) || 0));
    setAbilities((current) => ({ ...current, [name]: nextValue }));
  }

  function startGame() {
    setAbilities(Object.fromEntries(Object.keys(initialAbilities).map((name) => [name, Number(abilities[name]) || 0])));
    onStart();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.20),transparent_28%),linear-gradient(135deg,#020617,#07111f_45%,#020617)] p-6 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl items-center gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-8">
          <div className="mb-5 text-xs uppercase tracking-[0.28em] text-sky-100/60">序章</div>
          <h1 className="text-5xl font-semibold tracking-tight">Rose 推开的那扇门</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">商场已经打烊。你只是想穿过员工通道离开，却在本该是水泥墙的地方，看见了一扇蓝色木门。</p>
          <p className="mt-4 leading-7 text-slate-400">你的手机亮起，一条没有发件人的短信躺在屏幕中央：</p>
          <button type="button" onClick={() => setOpened(true)} className={`mt-6 w-full rounded-3xl border border-amber-200/20 p-5 text-left transition ${opened ? "bg-amber-200/[0.035]" : "animate-pulse bg-amber-200/5 hover:bg-amber-200/[0.07]"}`}>
            <div className="text-xs uppercase tracking-[0.24em] text-amber-100/60">unknown sender</div>
            <div className="mt-3 whitespace-pre-line text-xl font-semibold leading-8 text-amber-50">{opened ? "ROSE OPENED HERS.\nNOW IT’S YOUR TURN." : "YOU RECEIVED A MESSAGE."}</div>
          </button>
        </Panel>
        <Panel className="p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-violet-100/60">角色准备</div>
          <h2 className="mt-2 text-2xl font-semibold">填写基础数值</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">四项合计最多 5 点。不想分配就全部留 0。</p>
          <div className={`mt-4 rounded-2xl border px-4 py-3 ${overLimit ? "border-rose-200/30 bg-rose-200/10" : "border-white/10 bg-white/5"}`}>
            <div className="flex justify-between text-sm"><span className="text-slate-400">已分配基础点</span><span className={overLimit ? "text-rose-100" : "text-sky-100"}>{total}/{maxAbilityTotal}</span></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {Object.keys(abilities).map((name) => (
              <label key={name} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <span className="mb-2 block text-sm font-semibold text-slate-200">{name}</span>
                <input type="number" min="0" max="3" value={abilities[name]} onChange={(event) => updateAbility(name, event.target.value)} className="h-11 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 text-slate-100 outline-none focus:border-sky-200/50" />
              </label>
            ))}
          </div>
          <button type="button" onClick={startGame} disabled={overLimit} className="mt-5 h-12 w-full rounded-2xl bg-sky-200 text-sm font-semibold text-slate-950 hover:bg-sky-100 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">开始进入通道</button>
        </Panel>
      </div>
    </div>
  );
}

export default function DWDoorWorkbenchMockup() {
  const [started, setStarted] = useState(false);
  const [abilities, setAbilities] = useState(initialAbilities);
  const [currentId, setCurrentId] = useState("door");
  const [mode, setMode] = useState("游玩");
  const [pending, setPending] = useState(null);
  const [rollInput, setRollInput] = useState("");
  const [lastRoll, setLastRoll] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const [logOrder, setLogOrder] = useState("oldest");
  const [log, setLog] = useState([
    { who: "主持人", text: "商场已经打烊。雨声从天花板上方的通风口里传来。" },
    { who: "主持人", text: "员工通道尽头，一扇蓝门安静地等在那里，像它一直都在。" },
  ]);
  const [stats, setStats] = useState({ 好奇心: 1, 恐惧: 0, 时间静电: 0 });
  const node = nodes[currentId] || nodes.door;
  const total = Object.values(abilities).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const displayedLog = useMemo(() => (logOrder === "newest" ? [...log].reverse() : log), [log, logOrder]);

  function choose(choice) {
    setPending(choice);
    setRollInput("");
    setLastCheck({ ...choice, status: "等待掷骰" });
    setLog((current) => [...current, { who: "玩家", text: `准备行动：${choice.label}` }, { who: "主持人", text: mode === "搭建" ? `这是一次${choice.ability}检定，难度 DC ${choice.dc}。` : `这是一次${choice.ability}检定。` }]);
  }

  function resolveRoll() {
    if (!pending) return;
    const roll = Number.parseInt(rollInput, 10);
    if (!Number.isInteger(roll) || roll < 1 || roll > 20) return;
    const bonus = Number(abilities[pending.ability]) || 0;
    const totalRoll = roll + bonus;
    const success = totalRoll >= pending.dc;
    const result = success ? "成功" : "失败";
    const nextNode = nodes[pending.next] || node;
    setLastRoll(roll);
    setLastCheck({ ...pending, roll, bonus, total: totalRoll, status: result });
    setStats((current) => ({ 好奇心: Math.min(6, current.好奇心 + (success ? 1 : 0)), 恐惧: Math.min(6, current.恐惧 + (success ? 0 : 1)), 时间静电: Math.min(6, current.时间静电 + (pending.next === "pull" ? 2 : 1)) }));
    setLog((current) => [...current, { who: "骰子", text: mode === "搭建" ? `${pending.ability}检定：d20=${roll}，加值 ${bonus}，合计 ${totalRoll}，对抗 DC ${pending.dc}，${result}。` : `${pending.ability}检定：d20=${roll}，${result}。` }, { who: "主持人", text: nextNode.text }]);
    setCurrentId(pending.next);
    setPending(null);
    setRollInput("");
  }

  if (!started) return <StartScreen abilities={abilities} setAbilities={setAbilities} onStart={() => setStarted(true)} />;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.18),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,.10),transparent_26%),linear-gradient(135deg,#020617,#07111f_45%,#020617)] p-4 text-slate-100 md:p-6">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <header className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight md:text-4xl">Rose 推开的那扇门</h1>
          <button type="button" onClick={() => setMode(mode === "游玩" ? "搭建" : "游玩")} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">{mode === "游玩" ? "创作者入口" : "返回游玩"}</button>
        </header>
        <main className="grid gap-4 lg:grid-cols-[0.9fr_1.35fr_0.95fr]">
          <Panel className="min-h-[720px] p-4">
            <div className="mb-4 flex items-center justify-between"><div className="font-semibold">跑团记录</div><button type="button" onClick={() => setLogOrder(logOrder === "oldest" ? "newest" : "oldest")} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">排序</button></div>
            <div className="space-y-3">
              {displayedLog.map((entry, index) => <div key={`${entry.who}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"><div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-400">{entry.who}</div><p className="text-sm leading-6 text-slate-200/90">{entry.text}</p></div>)}
            </div>
          </Panel>
          <Panel className="relative min-h-[720px] overflow-hidden p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-amber-100/60">当前场景节点</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{node.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{node.scene}</p>
            <div className="mt-5 grid gap-5 xl:grid-cols-[0.45fr_1.55fr]">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-3"><DoorMotif nodeId={currentId} /><div className="mt-2 flex flex-wrap justify-center gap-1.5">{node.tags.map((tag) => <span key={tag} className="rounded-full border border-sky-300/20 bg-sky-300/5 px-2 py-1 text-[10px] text-sky-100/70">{tag}</span>)}</div></div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"><div className="mb-3 text-xs uppercase tracking-[0.24em] text-sky-100/50">{node.location}</div><p className="text-lg leading-8 text-slate-100/95">{node.text}</p><div className="my-5 rounded-2xl border border-amber-200/20 bg-amber-200/5 p-4"><div className="mb-1 text-[10px] uppercase tracking-[0.24em] text-amber-100/60">关键物件</div><div className="font-medium leading-7 text-amber-50">{node.object}</div></div><p className="text-sm leading-6 text-slate-300/80">{node.hint}</p></div>
            </div>
            {pending && <div className="mt-5 rounded-3xl border border-violet-200/25 bg-violet-200/[0.07] p-5"><div className="text-xs uppercase tracking-[0.22em] text-violet-100/70">等待骰子判定</div><p className="mt-2 text-2xl font-semibold">{pending.label}</p><p className="mt-1 text-sm text-slate-300">{mode === "搭建" ? `${pending.ability}检定 · DC ${pending.dc}` : `${pending.ability}检定 · 掷 d20`}</p><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_72px]"><input value={rollInput} onChange={(event) => setRollInput(event.target.value)} placeholder="输入 1-20" className="h-11 rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-100 outline-none" /><button type="button" onClick={() => setRollInput(String(rollD20()))} className="rounded-2xl border border-violet-200/30 bg-violet-200/10 text-sm font-semibold text-violet-100">🎲 掷 d20</button><button type="button" onClick={resolveRoll} className="rounded-2xl bg-amber-200 text-sm font-semibold text-slate-950">确认</button></div></div>}
            <div className="mt-5 grid gap-3 md:grid-cols-2">{node.choices.map((choice) => <button key={choice.label} type="button" onClick={() => choose(choice)} disabled={Boolean(pending)} className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-left transition hover:border-amber-200/40 hover:bg-amber-100/10 disabled:cursor-not-allowed disabled:opacity-45"><span className="flex items-center gap-3"><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-amber-100">{choice.icon}</span><span className="font-medium">{choice.label}</span></span><span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-slate-400">{mode === "搭建" ? `${choice.ability} DC ${choice.dc}` : `${choice.ability}检定`}</span></button>)}</div>
          </Panel>
          <Panel className="min-h-[720px] p-4">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{mode === "搭建" ? "制作笔记" : "角色面板"}</h2><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">{mode}</span></div>
            <div className="rounded-3xl border border-violet-200/15 bg-violet-200/5 p-4"><div className="mb-3 text-sm font-semibold">⚄ 骰子 / 状态</div><div className="mb-3 rounded-2xl bg-black/20 p-3 text-sm text-slate-300">上次掷骰：<span className="font-semibold text-amber-100">{lastRoll ?? "尚未掷骰"}</span></div><div className="mb-4 rounded-2xl border border-sky-200/15 bg-sky-200/5 p-3"><div className="mb-2 flex items-center justify-between"><span className="text-xs uppercase tracking-[0.2em] text-sky-100/60">角色能力加值</span><span className="text-[11px] text-slate-500">{total}/{maxAbilityTotal}</span></div><div className="grid grid-cols-2 gap-2">{Object.keys(abilities).map((name) => <div key={name} className="rounded-2xl border border-white/10 bg-black/15 px-3 py-2 text-xs text-slate-300"><span className="mb-1 block text-slate-400">{name}</span><span className="block rounded-xl border border-white/10 bg-slate-950/80 px-2 py-1 text-sm font-semibold text-slate-100">{Number(abilities[name]) || 0}</span></div>)}</div><p className="mt-2 text-[11px] leading-5 text-slate-500">开局已设定；结算时使用 d20 + 对应能力加值。</p></div><div className="space-y-3">{Object.entries(stats).map(([name, value]) => <div key={name}><div className="mb-1 flex justify-between text-xs"><span>{name}</span><span className="text-slate-500">{value}/6</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-slate-100" style={{ width: `${(value / 6) * 100}%` }} /></div></div>)}</div></div>
            {mode === "搭建" && <div className="mt-4 space-y-2 rounded-3xl border border-white/10 bg-white/[0.03] p-4"><div className="text-sm font-semibold">制作备注</div>{node.notes.map((note) => <div key={note} className="rounded-2xl border border-white/10 bg-black/15 px-3 py-2 text-sm leading-6 text-slate-300">{note}</div>)}</div>}
          </Panel>
        </main>
      </div>
    </div>
  );
}
