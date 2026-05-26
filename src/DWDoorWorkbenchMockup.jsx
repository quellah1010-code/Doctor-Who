import React, { useEffect, useMemo, useRef, useState } from "react";

const nodes = {
  "1-a": { id:"1-a", title:"1-A 洗衣店门口", scene:"第 01 幕", location:"Powell Estate 洗衣店", atmosphere:["夜雨","滚筒敲击"], text:"Rose 停在洗衣店门口，里面传出不自然的尖叫与敲击。", object:"门把手是湿的，像刚被谁抓过。", hint:"先确认 Jackie 的反应。", choices:[{id:"c_1a_to_1b",label:"走进去找 Jackie",intent:"approach",actionType:"move",noCheck:true,next:"1-b",resultText:"你推门而入。"}]},
  "1-b": { id:"1-b", title:"1-B Jackie 的话", scene:"第 01 幕", location:"洗衣机排前", atmosphere:["争执","担心"], text:"Jackie 盯着你：\"Rose, don’t you dare pretend this is normal.\"", object:"最里面那台洗衣机敲了三下。", hint:"你要先安抚还是先靠近门？", choices:[{id:"c_1b_opt",label:"先安抚 Jackie",intent:"optional",actionType:"talk",noCheck:true,consumeOnUse:true,logText:"你压低声音让 Jackie 先后退半步。",relationshipDelta:{jackie:1},abilityTempDelta:{冷静:1}},{id:"c_1b_to_1c",label:"靠近蓝门",intent:"progress",actionType:"move",noCheck:true,next:"1-c",resultText:"你靠近了那扇门。"}]},
  "1-c": { id:"1-c", title:"1-C 第一次敲门", scene:"第 01 幕", location:"蓝门前", atmosphere:["静电","回音"], text:"你抬手敲门，里面几乎同时敲回。", object:"三下，停顿，再三下。", hint:"要不要立刻开门？", choices:[{id:"c_1c_open",label:"拉开门",intent:"open",actionType:"check",check:{name:"胆量",dc:10},resultText:"门轴发出低鸣。",smoothText:"你稳住呼吸，门被你控制住。",blockedText:"门猛地反拉，你差点摔进去。",smoothNext:"branch_open_door",blockedNext:"branch_open_door",flagsAddAlways:["first_knock"]}]},
  "branch_open_door": { id:"branch_open_door", title:"branch_open_door 开门后果", scene:"第 01 幕", location:"门缝", atmosphere:["金光","墙体震动"], text:"门后传来 TARDIS 的低鸣。", object:"Jackie 本能地往前一步。", hint:"手机亮起了。", choices:[{id:"c_branch_to_1d",label:"查看来信",intent:"progress",actionType:"move",noCheck:true,next:"1-d",resultText:"短信弹出。"}]},
  "1-d": { id:"1-d", title:"1-D TARDIS 来信", scene:"第 01 幕", location:"洗衣店中间", atmosphere:["短信","规则"], text:"屏幕出现：KNOCK BACK。", object:"下一行：BOTH OF YOU。", hint:"墙面开始开裂。", choices:[{id:"c_1d_to_2a",label:"抬头看墙",intent:"progress",actionType:"move",noCheck:true,next:"2-a",resultText:"裂缝扩散。"}]},
  "2-a": { id:"2-a", title:"2-A 墙裂开了 / 蓝门出现", scene:"第 02 幕", location:"洗衣店后墙", atmosphere:["裂缝","蓝门"], text:"砖墙裂开，蓝门从裂口里挤出来。", object:"所有能开合的东西都在敲回去。", hint:"有人冲进来了。", choices:[{id:"c_2a_to_2b",label:"退到店中央",intent:"progress",actionType:"move",noCheck:true,next:"2-b",resultText:"你们暂时拉开距离。"}]},
  "2-b": { id:"2-b", title:"2-B Mickey 进场 & 规则", scene:"第 02 幕", location:"洗衣店前门", atmosphere:["雨水","球棒"], text:"Mickey 冲进来，同时厕所门里传出他的声音。", object:"RULE THREE: A REAL PERSON CAN KNOCK BACK.", hint:"需要先稳定队形。", choices:[{id:"c_2b_a",label:"告诉 Mickey 不要开任何门",intent:"command",actionType:"move",noCheck:true,next:"2-c",resultText:"Mickey 点头，握紧球棒。"},{id:"c_2b_b",label:"核对真伪后再部署",intent:"check",actionType:"check",check:{name:"感知",dc:9},resultText:"你快速比对声音来源。",smoothText:"你确认厕所里的 Mickey 是假的。",blockedText:"你迟疑了一秒，气氛更紧。",smoothNext:"2-c",blockedNext:"2-c",publicStatsDeltaBlocked:{fear:1}}]},
  "2-c": { id:"2-c", title:"2-C Jackie 和 Doctor（占位）", scene:"第 02 幕", location:"蓝门前", atmosphere:["占位"], text:"Jackie 问：Doctor 在哪？这里是 2-B 汇合占位节点。", object:"（待后续章节实现）", hint:"本轮到 2-B 为止。", choices:[]}
};
const chapterGroups = [
  { id: "page-01", label: "Page 1", title: "序章 / 角色准备", page: "start", nodeIds: [] },
  { id: "chapter-01", label: "第 01 幕", title: "尖叫的洗衣店", nodeIds: ["1-a","1-b","1-c","branch_open_door","1-d"] },
  { id: "chapter-02", label: "第 02 幕", title: "蓝色的门", nodeIds: ["2-a","2-b","2-c"] },
];

const maxAbilityTotal = 5;
const maxSingleAbility = 3;
const fullIntroMessage = ["KNOCK BACK.", "BOTH OF YOU."].join(String.fromCharCode(10));
const initialAbilities = { 感知: 0, 机智: 0, 胆量: 0, 冷静: 0 };
const initialLog = [
  { who: "主持人", text: "Father's Day 当晚，Rose 路过洗衣店，听见滚筒在尖叫。" },
  { who: "系统", text: "节点已载入：1-A 洗衣店门口" },
];

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function getAbilityTotal(abilities) {
  return Object.values(abilities).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

function formatLocalTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function rollD20() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const max = 4294967296 - (4294967296 % 20);
    const bucket = new Uint32Array(1);
    do {
      crypto.getRandomValues(bucket);
    } while (bucket[0] >= max);
    return (bucket[0] % 20) + 1;
  }
  return Math.floor(Math.random() * 20) + 1;
}

function getCheck(choice) {
  const table = {
    listen: { name: "感知", dc: 12, success: "你听见门后的声音变清楚了。", fail: "你只听见自己的声音从门后重复回来。" },
    phone: { name: "机智", dc: 10, success: "你抓住了手机异常亮起的那一秒。", fail: "屏幕闪了一下，短信像水渍一样散开。" },
    pull: { name: "胆量", dc: 14, success: "门顺着你的动作打开，金色光没有立刻吞没你。", fail: "门开了，但你的影子先被吸进了门缝。" },
    stepback: { name: "冷静", dc: 9, success: "你稳住呼吸，后退时没有把目光从门上移开。", fail: "你退得太快，走廊的出口标识在你身后改变了方向。" },
    door: { name: "定神", dc: 8, success: "你把自己重新拉回当前的走廊。", fail: "你以为自己回到了原点，但墙上的影子不太对。" },
  };
  return table[choice.next] || { name: "行动", dc: 10, success: "行动推进。", fail: "行动推进，但代价变得更明显。" };
}

function getDelta(next, success) {
  if (next === "pull") return success ? { curiosity: 1, timeStatic: 1 } : { curiosity: 1, fear: 1, timeStatic: 2 };
  if (next === "stepback") return success ? { fear: 1 } : { fear: 2, timeStatic: 1 };
  if (next === "listen") return success ? { curiosity: 1, timeStatic: 1 } : { fear: 1, timeStatic: 1 };
  if (next === "phone") return success ? { curiosity: 1, timeStatic: 1 } : { fear: 1, timeStatic: 1 };
  return success ? {} : { fear: 1 };
}

function Badge({ children }) {
  return <span className="rounded-full border border-sky-300/20 bg-sky-300/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-sky-100/70">{children}</span>;
}

function Panel({ children, className = "" }) {
  return <div className={`rounded-3xl border border-white/10 bg-slate-950/55 shadow-2xl shadow-black/30 backdrop-blur ${className}`}>{children}</div>;
}

function Section({ title, icon, items }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-100">
        <span className="text-amber-100">{icon}</span>
        {title}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-black/15 px-3 py-2 text-sm leading-6 text-slate-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function DoorMotif({ active }) {
  return (
    <div className="relative mx-auto flex h-44 w-28 items-center justify-center">
      <div className={`absolute left-1/2 top-4 h-36 w-2.5 -translate-x-1/2 rounded-full bg-amber-300 blur-xl transition-all duration-700 ${active ? "opacity-100 scale-y-110" : "opacity-50 scale-y-95"}`} />
      <div className="absolute h-40 w-24 rounded-t-2xl border border-sky-200/15 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 shadow-[0_0_40px_rgba(14,165,233,.15)]" />
      <div className="absolute top-7 grid grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="h-6 w-6 rounded-md border border-sky-100/20 bg-sky-100/10 shadow-inner" />
        ))}
      </div>
      <div className="absolute bottom-7 left-1/2 h-24 w-[3px] -translate-x-1/2 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(251,191,36,.9)]" />
      <div className="absolute bottom-16 right-5 h-2.5 w-2.5 rounded-full border border-amber-100/60 bg-amber-200/70" />
      <div className="absolute bottom-4 rounded bg-white/5 px-2.5 py-1 text-[8px] font-semibold tracking-[0.22em] text-white/60">PULL</div>
    </div>
  );
}

function PhoneMotif() {
  return (
    <div className="mx-auto flex h-44 w-28 items-center justify-center">
      <div className="h-40 w-24 rounded-[28px] border border-sky-100/20 bg-slate-950 p-2 shadow-[0_0_35px_rgba(56,189,248,.12)]">
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-slate-600/60" />
        <div className="flex h-[120px] flex-col justify-between rounded-2xl border border-sky-100/10 bg-gradient-to-b from-sky-950/80 to-slate-900 p-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[7px] text-sky-100/45">
              <span>NO SERVICE</span>
              <span>17%</span>
            </div>
            <div className="h-2 w-12 rounded-full bg-sky-100/25" />
            <div className="h-2 w-8 rounded-full bg-sky-100/15" />
          </div>
          <div className="rounded-xl border border-amber-100/20 bg-amber-100/10 p-2 text-[8px] font-semibold leading-3 text-amber-100">NO SENDER</div>
          <div className="h-2 w-10 rounded-full bg-sky-100/20" />
        </div>
      </div>
    </div>
  );
}

function ThresholdMotif() {
  return (
    <div className="relative mx-auto flex h-44 w-28 items-center justify-center overflow-hidden rounded-2xl border border-amber-100/10 bg-black/20">
      <div className="absolute h-40 w-16 rounded-full bg-amber-200/25 blur-2xl" />
      <div className="absolute left-1/2 h-44 w-[3px] -translate-x-1/2 bg-amber-100 shadow-[0_0_30px_rgba(251,191,36,.9)]" />
      <div className="absolute bottom-8 h-20 w-32 rotate-12 rounded-[50%] border border-amber-100/20" />
      <div className="absolute top-8 h-16 w-20 rounded-[50%] border border-sky-100/15" />
      <div className="absolute bottom-5 text-[8px] uppercase tracking-[0.22em] text-amber-100/70">threshold</div>
    </div>
  );
}

function ShadowMotif() {
  return (
    <div className="relative mx-auto flex h-44 w-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
      <div className="absolute top-8 h-24 w-16 rounded-t-2xl border border-sky-100/15 bg-blue-950/70" />
      <div className="absolute bottom-8 left-1/2 h-20 w-7 -translate-x-1/2 skew-x-[-18deg] rounded-full bg-slate-900 shadow-[0_0_22px_rgba(15,23,42,.9)]" />
      <div className="absolute right-5 top-14 h-2.5 w-2.5 rounded-full bg-amber-200/80" />
      <div className="absolute bottom-5 text-[8px] uppercase tracking-[0.22em] text-slate-400">exit?</div>
    </div>
  );
}

function SceneMotif({ nodeId, active, tags }) {
  const motif = useMemo(() => {
    if (nodeId === "phone") return <PhoneMotif />;
    if (nodeId === "pull") return <ThresholdMotif />;
    if (nodeId === "stepback") return <ShadowMotif />;
    return <DoorMotif active={active} />;
  }, [nodeId, active]);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-3">
      {motif}
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}

function CheckResultModal({ check, onClose }) {
  if (!check) return null;
  const isBlocked = check.statusLabel === "受阻";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5 text-slate-100">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[12px] backdrop-saturate-125" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_20%,rgba(125,211,252,.18),transparent_32%),radial-gradient(circle_at_70%_72%,rgba(251,191,36,.12),transparent_34%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-white/[0.035] blur-2xl" />

      <section className="relative w-full max-w-[480px] overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900/55 p-4 shadow-[0_28px_90px_rgba(0,0,0,.55)] backdrop-blur-xl md:p-5">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-sky-200/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/10" />

        <div className="relative w-full">
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.28em] text-sky-100/55">dice check</div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-100">本次检定</h2>
              <div className={`mr-2 shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${isBlocked ? "border-amber-200/20 bg-amber-200/10 text-amber-50" : "border-sky-200/20 bg-sky-200/10 text-sky-50"}`}>
                {check.statusLabel}
              </div>
            </div>
          </div>

          <div className="grid gap-2 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">行动</span>
              <span className="font-medium text-slate-100">{check.action}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">检定</span>
              <span className="font-medium text-slate-100">{check.checkName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">骰点</span>
              <span className="font-medium text-slate-100">d20 = {check.roll}</span>
            </div>
            {check.bonus !== 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">加值</span>
                <span className="font-medium text-slate-100">{check.bonus >= 0 ? `+${check.bonus}` : check.bonus}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">合计</span>
              <span className="font-medium text-slate-100">{check.total}</span>
            </div>
          </div>

          {check.resultText && (
            <div className="mt-4 rounded-3xl border border-amber-200/15 bg-amber-200/[0.06] p-4">
              <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-amber-100/60">result text</div>
              <p className="text-base leading-7 text-amber-50/95">{check.resultText}</p>
            </div>
          )}

          <button type="button" onClick={onClose} className="mt-5 h-12 w-full rounded-2xl bg-sky-200 text-sm font-semibold text-slate-950 transition hover:bg-sky-100">
            继续
          </button>
        </div>
      </section>
    </div>
  );
}

function HardNavBar({ mode, started, activeChapter, hoveredChapter, chapterMenuOpen, openChapterMenu, scheduleCloseChapterMenu, closeChapterMenu, setHoveredChapterId, onPageOne, onSelectNode, onCreator, onReturnPlay, onSoundLab }) {
  return (
    <header className="relative z-40 -mx-4 border-b border-white/10 bg-slate-950/85 px-4 py-2 backdrop-blur md:-mx-6 md:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-sky-100/40">Doctor Who Interactive Lab</div>
          <div className="text-base font-semibold tracking-tight text-slate-100">Rose Door Workbench</div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-sky-200 px-3 py-1.5 text-xs text-slate-950">D&D Workbench</span>
          <div className="static md:relative" onMouseEnter={openChapterMenu} onMouseLeave={scheduleCloseChapterMenu}>
            <button
              type="button"
              onClick={() => {
                if (chapterMenuOpen) closeChapterMenu();
                else openChapterMenu();
              }}
              className="h-[30px] rounded-full border border-white/10 bg-white/5 px-3 text-xs text-slate-200 transition hover:bg-white/10"
            >
              章节 · {started ? activeChapter.label : "Page 1"}
            </button>
            {chapterMenuOpen && (
              <div className="absolute left-4 right-4 top-full z-50 mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur md:left-auto md:right-0 md:top-[34px] md:mt-0 md:min-w-[360px]">
                <div className="w-36 shrink-0 border-r border-white/10 p-2 md:w-40">
                  {chapterGroups.map((chapter) => (
                    <button
                      key={chapter.id}
                      type="button"
                      onMouseEnter={() => setHoveredChapterId(chapter.id)}
                      className={`w-full rounded-xl px-3 py-2 text-left transition ${hoveredChapter.id === chapter.id ? "bg-sky-200/15 text-sky-50" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
                    >
                      <div className="text-xs font-semibold">{chapter.label}</div>
                      <div className="mt-0.5 truncate text-[10px] text-slate-500">{chapter.title}</div>
                    </button>
                  ))}
                </div>
                <div className="min-w-0 flex-1 p-2 md:w-56 md:flex-none">
                  <div className="mb-1 px-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">分支</div>
                  {hoveredChapter.page === "start" ? (
                    <button type="button" onClick={onPageOne} className="w-full rounded-xl px-3 py-2 text-left text-slate-300 transition hover:bg-white/5 hover:text-slate-100">
                      <div className="truncate text-xs font-semibold">Page 1</div>
                      <div className="mt-0.5 truncate text-[10px] text-slate-500">序章 / 角色准备</div>
                    </button>
                  ) : (
                    hoveredChapter.nodeIds.map((nodeId) => {
                      const item = nodes[nodeId];
                      return (
                        <button key={item.id} type="button" onClick={() => onSelectNode(item.id)} className="w-full rounded-xl px-3 py-2 text-left text-slate-300 transition hover:bg-white/5 hover:text-slate-100">
                          <div className="truncate text-xs font-semibold">{item.title}</div>
                          <div className="mt-0.5 truncate text-[10px] text-slate-500">{item.scene}</div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          <button type="button" onClick={onSoundLab} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10">
            Sound Lab
          </button>
          {mode === "游玩" ? (
            <button type="button" onClick={onCreator} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10">
              创作者入口
            </button>
          ) : (
            <>
              <span className="rounded-full border border-sky-200/30 bg-sky-200/10 px-3 py-1.5 text-xs text-sky-100">搭建模式</span>
              <button type="button" onClick={onReturnPlay} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10">
                返回游玩
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function StartScreen({ abilities, setAbilities, onStart, navProps }) {
  const [messageOpened, setMessageOpened] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const abilityTotal = getAbilityTotal(abilities);
  const abilityOverLimit = abilityTotal > maxAbilityTotal;
  const abilityProgress = Math.min(100, (abilityTotal / maxAbilityTotal) * 100);

  useEffect(() => {
    if (!messageOpened) {
      setTypedMessage("");
      return undefined;
    }
    let index = 0;
    setTypedMessage("");
    const timer = window.setInterval(() => {
      index += 1;
      setTypedMessage(fullIntroMessage.slice(0, index));
      if (index >= fullIntroMessage.length) window.clearInterval(timer);
    }, 42);
    return () => window.clearInterval(timer);
  }, [messageOpened]);

  function updateAbility(name, raw) {
    if (raw === "") {
      setAbilities((current) => ({ ...current, [name]: "" }));
      return;
    }
    const parsed = Number.parseInt(raw, 10);
    const nextValue = clampNumber(parsed, 0, maxSingleAbility);
    setAbilities((current) => ({ ...current, [name]: nextValue }));
  }

  function startGame() {
    const normalized = Object.fromEntries(Object.keys(initialAbilities).map((name) => [name, Number(abilities[name]) || 0]));
    setAbilities(normalized);
    onStart();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.20),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(251,191,36,.12),transparent_28%),linear-gradient(135deg,#020617,#07111f_45%,#020617)] px-4 pb-4 pt-0 text-slate-100 md:px-6 md:pb-6 md:pt-0">
      <HardNavBar {...navProps} started={false} />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1100px] items-center justify-center">
        <div className="grid w-full gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Panel className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-lg uppercase tracking-[0.16em] text-sky-100/75">
                <span className="h-2 w-2 rounded-full bg-sky-200/75" />
                序章
              </div>
              <h1 className="text-[3rem] font-semibold leading-[1.08] tracking-tight">KNOCK BACK / 敲回去</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Father's Day 当晚，Doctor 把 Rose 送回 Powell Estate，TARDIS 离开后，Jackie 发来短信让她买牛奶。Rose 路过洗衣店，听见洗衣店在尖叫。</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">你停在门口，里面的洗衣机正用不该出现的节奏敲击滚筒。</p>
              <button
                type="button"
                onClick={() => setMessageOpened(true)}
                className={`mt-6 w-full cursor-pointer rounded-3xl border p-5 text-left transition-all duration-300 ${messageOpened ? "border-amber-200/20 bg-amber-200/[0.035]" : "animate-pulse border-amber-200/20 bg-amber-200/5 hover:-translate-y-[2px] hover:border-amber-200/40 hover:bg-amber-200/[0.07] hover:shadow-[0_0_34px_rgba(251,191,36,.10)]"}`}
              >
                <div className="text-xs uppercase tracking-[0.24em] text-amber-100/60">unknown sender</div>
                <div className="mt-3 text-xl font-semibold leading-8 text-amber-50">
                  {messageOpened ? (
                    <span className="whitespace-pre-line">
                      {typedMessage}
                      {typedMessage.length < fullIntroMessage.length && <span className="animate-pulse">▌</span>}
                    </span>
                  ) : (
                    "YOU RECEIVED A MESSAGE."
                  )}
                </div>
              </button>
            </div>
          </Panel>

          <Panel className="p-5 md:p-6">
            <div className="mb-5">
              <div className="text-xs uppercase tracking-[0.24em] text-violet-100/60">角色准备</div>
              <h2 className="mt-2 text-2xl font-semibold">填写基础数值</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">四项合计最多 5 点。不想分配就全部留 0。</p>
              <div className={`mt-3 rounded-2xl border px-4 py-3 ${abilityOverLimit ? "border-rose-200/30 bg-rose-200/10" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">已分配基础点</span>
                  <span className={`tabular-nums font-semibold ${abilityOverLimit ? "text-rose-100" : "text-sky-100"}`}>{abilityTotal}/{maxAbilityTotal}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full transition-all duration-300 ${abilityOverLimit ? "bg-rose-200" : "bg-sky-200"}`} style={{ width: `${abilityProgress}%` }} />
                </div>
                {abilityOverLimit && <p className="mt-2 text-xs text-rose-200">基础点超过上限，请控制在 {maxAbilityTotal} 以内。</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.keys(abilities).map((name) => (
                <label key={name} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <span className="mb-2 block text-sm font-semibold text-slate-200">{name}</span>
                  <input
                    type="number"
                    min="0"
                    max={maxSingleAbility}
                    placeholder={`0-${maxSingleAbility}`}
                    value={abilities[name]}
                    onChange={(event) => updateAbility(name, event.target.value)}
                    className="h-11 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-200/50"
                  />
                  <span className="mt-2 block text-[11px] leading-5 text-slate-500">{name === "感知" ? "听见异常、捕捉细节" : name === "机智" ? "处理设备、理解线索" : name === "胆量" ? "面对门后的未知" : "在异常里稳住自己"}</span>
                </label>
              ))}
            </div>

            <button type="button" onClick={startGame} disabled={abilityOverLimit} className="mt-5 h-12 w-full rounded-2xl bg-sky-200 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
              开始进入洗衣店
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function BuildGateModal({ buildPassword, buildPasswordError, setBuildPassword, setBuildPasswordError, submitBuildPassword, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/50">
        <div className="text-xs uppercase tracking-[0.24em] text-sky-100/60">creator gate</div>
        <h2 className="mt-2 text-2xl font-semibold">进入搭建模式</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">请输入创作者密码。</p>
        <input
          value={buildPassword}
          onChange={(event) => {
            setBuildPassword(event.target.value);
            setBuildPasswordError("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") submitBuildPassword();
            if (event.key === "Escape") onCancel();
          }}
          autoFocus
          type="password"
          placeholder="密码"
          className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-200/50"
        />
        {buildPasswordError && <p className="mt-2 text-sm text-rose-200">{buildPasswordError}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 hover:bg-white/10">
            取消
          </button>
          <button type="button" onClick={submitBuildPassword} className="rounded-2xl bg-sky-200 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-100">
            进入
          </button>
        </div>
      </div>
    </div>
  );
}

function LogPanelContent({ displayedLog, log, logOrder, setLogOrder, localNow }) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-7 items-center gap-1">
          <svg viewBox="0 0 18 18" aria-hidden="true" className="h-[22px] w-[22px] shrink-0 text-sky-200">
            <rect x="3" y="4" width="12" height="10" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 7H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M6 10H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="font-semibold leading-none">跑团记录</span>
          <button
            type="button"
            onClick={() => setLogOrder(logOrder === "oldest" ? "newest" : "oldest")}
            title={logOrder === "oldest" ? "当前：旧到新。点击切换为新到旧" : "当前：新到旧。点击切换为旧到新"}
            className="ml-0.5 flex h-[18px] w-[18px] translate-y-[0.5px] items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-sky-100"
          >
            <svg viewBox="0 0 18 18" aria-hidden="true" className="h-[13px] w-[13px]">
              {logOrder === "oldest" ? (
                <g>
                  <path d="M3 5H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M3 9H12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M3 13H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  <path d="M3 5H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M3 9H12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M3 13H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </g>
              )}
            </svg>
          </button>
        </div>
        <span className="text-xs text-slate-400">{log.length} 条记录</span>
      </div>
      <div className="space-y-3 overflow-hidden">
        {displayedLog.map((entry, index) => (
          <div
            key={`${entry.who}-${index}-${entry.text}`}
            className={`rounded-2xl border p-3 ${entry.who === "主持人" ? "border-sky-300/15 bg-sky-300/5" : entry.who === "玩家" ? "border-amber-300/20 bg-amber-300/5" : entry.who === "骰子" ? "border-violet-300/20 bg-violet-300/5" : "border-white/10 bg-white/[0.03]"}`}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{entry.who}</span>
              <span className="shrink-0 text-[10px] tabular-nums text-slate-500">{entry.timeLabel || formatLocalTime(localNow)}</span>
            </div>
            <p className="text-sm leading-6 text-slate-200/90">{entry.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function CharacterPanelContent({ mode, lastRoll, abilities, abilityTotal, statBars, node }) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-7 items-center gap-1.5">
          <svg viewBox="0 0 18 18" aria-hidden="true" className="h-[20px] w-[20px] shrink-0 text-amber-100">
            <rect x="4" y="3" width="10" height="12" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 6H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M7 9H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M7 12H9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <h2 className="font-semibold leading-none">{mode === "搭建" ? "制作笔记" : "角色面板"}</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">{mode}</div>
      </div>

      <div className="mb-4 rounded-3xl border border-violet-200/15 bg-violet-200/5 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">⚄ 骰子 / 状态</div>
        <div className="mb-3 rounded-2xl bg-black/20 p-3 text-sm text-slate-300">
          上次掷骰：<span className="font-semibold text-amber-100">{lastRoll ?? "尚未掷骰"}</span>
        </div>
        <div className="mb-4 rounded-2xl border border-sky-200/15 bg-sky-200/5 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-sky-100/60">角色能力加值</span>
            <span className="text-[11px] text-slate-500">{abilityTotal}/{maxAbilityTotal}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(abilities).map((name) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-black/15 px-3 py-2 text-xs text-slate-300">
                <span className="mb-1 block text-slate-400">{name}</span>
                <span className="block rounded-xl border border-white/10 bg-slate-950/80 px-2 py-1 text-sm font-semibold text-slate-100">{Number(abilities[name]) || 0}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">开局已设定；结算时使用 d20 + 对应能力加值。</p>
        </div>
        <div className="mb-2 text-xs uppercase tracking-[0.2em] text-violet-100/60">当前状态</div>
        <div className="space-y-3">
          {statBars.map(([name, value, caption]) => (
            <div key={name}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{name}</span>
                <span className="text-slate-500">{value}/6</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-slate-100 transition-all duration-300" style={{ width: `${(value / 6) * 100}%` }} />
              </div>
              <div className="mt-1 text-[11px] text-slate-500">{caption}</div>
            </div>
          ))}
        </div>
      </div>

      {mode === "搭建" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span className="text-sky-100">✦</span> 节点目的
            </div>
            <p className="text-sm leading-6 text-slate-300">{node.notes.purpose}</p>
          </div>
          <Section title="交互逻辑" icon="⌁" items={node.notes.interactions} />
          <Section title="隐藏变量" icon="✧" items={node.notes.variables} />
          <Section title="声音想法" icon="◌" items={node.notes.audio} />
          <Section title="制作备注" icon="▦" items={node.notes.build} />
        </div>
      )}
    </>
  );
}

function MobileGlobalDrawer({
  open,
  activeTab,
  setActiveTab,
  onClose,
  displayedLog,
  log,
  logOrder,
  setLogOrder,
  localNow,
  mode,
  lastRoll,
  abilities,
  abilityTotal,
  statBars,
  node,
}) {
  if (!open) return null;

  const logActive = activeTab === "log";
  const tabClass = "h-10 rounded-2xl text-sm font-semibold transition";

  return (
    <div className="fixed inset-0 z-[65] text-slate-100 xl:hidden">
      <button type="button" aria-label="关闭总览面板" onClick={onClose} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px]" />
      <aside className="relative h-full w-[min(88vw,390px)] overflow-y-auto border-r border-white/10 bg-slate-950/90 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-sky-100/45">global</div>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">总览面板</h2>
          </div>
          <button type="button" onClick={onClose} className="h-9 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-slate-300 transition hover:bg-white/10">
            关闭
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-1.5">
          <button
            type="button"
            aria-pressed={logActive}
            onClick={() => setActiveTab("log")}
            className={`${tabClass} ${logActive ? "bg-sky-200 text-slate-950" : "bg-transparent text-slate-300 hover:bg-white/10"}`}
          >
            跑团记录
          </button>
          <button
            type="button"
            aria-pressed={!logActive}
            onClick={() => setActiveTab("character")}
            className={`${tabClass} ${!logActive ? "bg-sky-200 text-slate-950" : "bg-transparent text-slate-300 hover:bg-white/10"}`}
          >
            角色状态
          </button>
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
          {logActive ? (
            <LogPanelContent displayedLog={displayedLog} log={log} logOrder={logOrder} setLogOrder={setLogOrder} localNow={localNow} />
          ) : (
            <CharacterPanelContent mode={mode} lastRoll={lastRoll} abilities={abilities} abilityTotal={abilityTotal} statBars={statBars} node={node} />
          )}
        </div>
      </aside>
    </div>
  );
}

export default function DWDoorWorkbenchMockup({ onOpenSoundLab = () => {} }) {
  const [currentId, setCurrentId] = useState("1-a");
  const [log, setLog] = useState(initialLog);
  const [mode, setMode] = useState("游玩");
  const [stats, setStats] = useState({ curiosity: 0, fear: 0, timeStatic: 0 });
  const [flags, setFlags] = useState([]);
  const [usedOptionalChoiceIds, setUsedOptionalChoiceIds] = useState([]);
  const [relationshipState, setRelationshipState] = useState({});
  const [abilityTempBonus, setAbilityTempBonus] = useState({});
  const [records, setRecords] = useState([]);
  const [abilities, setAbilities] = useState(initialAbilities);
  const [logOrder, setLogOrder] = useState("oldest");
  const [localNow, setLocalNow] = useState(() => new Date());
  const [lastRoll, setLastRoll] = useState(null);
  const [checkModal, setCheckModal] = useState(null);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [rollInput, setRollInput] = useState("");
  const [rollError, setRollError] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [showBuildGate, setShowBuildGate] = useState(false);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const [hoveredChapterId, setHoveredChapterId] = useState("page-01");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileDrawerTab, setMobileDrawerTab] = useState("log");
  const [buildPassword, setBuildPassword] = useState("");
  const [buildPasswordError, setBuildPasswordError] = useState("");
  const chapterCloseTimer = useRef(null);
  const storyTextRef = useRef(null);
  const abilityTotal = getAbilityTotal(abilities);

  useEffect(() => {
    const timer = window.setInterval(() => setLocalNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (chapterCloseTimer.current) window.clearTimeout(chapterCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!mobileDrawerOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") setMobileDrawerOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen]);

  const node = nodes[currentId] || nodes.door;
  const sceneTimeLabel = formatLocalTime(localNow);
  const activeChapter = chapterGroups.find((chapter) => chapter.nodeIds.includes(currentId)) || chapterGroups[1];
  const hoveredChapter = chapterGroups.find((chapter) => chapter.id === hoveredChapterId) || activeChapter;
  const doorActive = ["pull", "listen"].includes(currentId) || pendingChoice?.next === "pull";
  const pendingCheck = pendingChoice ? getCheck(pendingChoice) : null;
  const displayedLog = useMemo(() => {
    const recent = log.slice(-12);
    return logOrder === "newest" ? [...recent].reverse() : recent;
  }, [log, logOrder]);
  const statBars = useMemo(
    () => [
      ["好奇心", stats.curiosity, "想知道真相的冲动"],
      ["恐惧", stats.fear, "身体正在说不要"],
      ["时间静电", stats.timeStatic, "现实正在开裂的程度"],
    ],
    [stats]
  );

  function enterBuildMode() {
    setShowBuildGate(true);
    setBuildPassword("");
    setBuildPasswordError("");
  }

  function submitBuildPassword() {
    if (buildPassword === "625924") {
      setMode("搭建");
      setShowBuildGate(false);
      setBuildPassword("");
      setBuildPasswordError("");
      return;
    }
    setBuildPasswordError("密码不对。");
  }

  function openChapterMenu() {
    if (chapterCloseTimer.current) window.clearTimeout(chapterCloseTimer.current);
    setChapterMenuOpen(true);
  }

  function scheduleCloseChapterMenu() {
    if (chapterCloseTimer.current) window.clearTimeout(chapterCloseTimer.current);
    chapterCloseTimer.current = window.setTimeout(() => setChapterMenuOpen(false), 420);
  }

  function closeChapterMenu() {
    if (chapterCloseTimer.current) window.clearTimeout(chapterCloseTimer.current);
    setChapterMenuOpen(false);
  }

  function clearPendingCheck() {
    setPendingChoice(null);
    setRollInput("");
    setRollError("");
    setCheckModal(null);
  }

  function returnToPageOne() {
    setHoveredChapterId("page-01");
    setCurrentId("1-a");
    clearPendingCheck();
    closeChapterMenu();
    setHasStarted(false);
  }

  function selectNodeFromMenu(nodeId) {
    setCurrentId(nodeId);
    clearPendingCheck();
    closeChapterMenu();
    setHasStarted(true);
  }

  function choose(choice) {
    if (choice.consumeOnUse && usedOptionalChoiceIds.includes(choice.id)) return;
    const check = choice.check || getCheck(choice);
    const applyOutcome = (isSmooth) => {
      const text = isSmooth ? (choice.smoothText || choice.resultText || "行动推进。") : (choice.blockedText || choice.resultText || "行动推进。")
      const nextId = (isSmooth ? choice.smoothNext : choice.blockedNext) || choice.next || currentId;
      const addFlags = [...(choice.flagsAddAlways||[]), ...(isSmooth ? (choice.flagsAddSmooth||[]) : (choice.flagsAddBlocked||[]))];
      if (addFlags.length) setFlags((f)=>Array.from(new Set([...f, ...addFlags])));
      if (choice.consumeOnUse) setUsedOptionalChoiceIds((c)=>Array.from(new Set([...c, choice.id])));
      const sDelta = choice.publicStatsDelta || {}; const sDelta2 = isSmooth ? (choice.publicStatsDeltaSmooth||{}) : (choice.publicStatsDeltaBlocked||{});
      setStats((st)=>({curiosity:(st.curiosity||0)+(sDelta.curiosity||0)+(sDelta2.curiosity||0), fear:(st.fear||0)+(sDelta.fear||0)+(sDelta2.fear||0), timeStatic:(st.timeStatic||0)+(sDelta.timeStatic||0)+(sDelta2.timeStatic||0)}));
      const aDelta = choice.abilityTempDelta || {}; const aDelta2 = isSmooth ? (choice.abilityTempDeltaSmooth||{}) : (choice.abilityTempDeltaBlocked||{});
      setAbilityTempBonus((ab)=>({ ...ab, ...Object.fromEntries([...new Set([...Object.keys(aDelta),...Object.keys(aDelta2)])].map(k=>[k,(ab[k]||0)+(aDelta[k]||0)+(aDelta2[k]||0)])) }));
      const rDelta = choice.relationshipDelta || {}; const rDelta2 = isSmooth ? (choice.relationshipDeltaSmooth||{}) : (choice.relationshipDeltaBlocked||{});
      setRelationshipState((rs)=>({ ...rs, ...Object.fromEntries([...new Set([...Object.keys(rDelta),...Object.keys(rDelta2)])].map(k=>[k,(rs[k]||0)+(rDelta[k]||0)+(rDelta2[k]||0)])) }));
      const rec = isSmooth ? (choice.playerRecordSmooth||choice.playerRecord) : (choice.playerRecordBlocked||choice.playerRecord); if (rec) setRecords((r)=>[...r,rec]);
      const logText = isSmooth ? (choice.logTextSmooth||choice.logText) : (choice.logTextBlocked||choice.logText);
      const timeLabel = formatLocalTime(localNow);
      setLog((l)=>[...l, ...(logText?[{who:"主持人",text:logText,timeLabel}]:[]), {who:"主持人",text,timeLabel}]);
      setCurrentId(nextId);
    };
    if (choice.noCheck) { applyOutcome(true); return; }
    setPendingChoice(choice);
    setRollInput("");
    setRollError("");
    setLog((currentLog) => [
      ...currentLog,
      { who: "玩家", text: `准备行动：${choice.label}`, timeLabel: formatLocalTime(localNow) },
      { who: "主持人", text: mode === "搭建" ? `这是一次${check.name}检定，难度 DC ${check.dc}。请输入 d20 点数，或点击随机掷骰。` : `这是一次${check.name}检定。请输入 d20 点数，或点击随机掷骰。`, timeLabel: formatLocalTime(localNow) },
    ]);
  }

  function randomRoll() {
    setRollInput(String(rollD20()));
    setRollError("");
  }

  function cancelRoll() {
    clearPendingCheck();
  }

  function resolveRoll() {
    if (!pendingChoice) return;
    const roll = Number.parseInt(rollInput, 10);
    if (!Number.isInteger(roll) || roll < 1 || roll > 20) {
      setRollError("请输入 1 到 20 之间的 d20 点数。");
      return;
    }
    const check = getCheck(pendingChoice);
    const bonus = (Number(abilities[check.name]) || 0) + (Number(abilityTempBonus[check.name]) || 0);
    const total = roll + bonus;
    const success = total >= check.dc;
    const delta = getDelta(pendingChoice.next, success);
    const resultText = success ? check.success : check.fail;
    const nextNode = nodes[pendingChoice.next] || node;
    const timeLabel = formatLocalTime(localNow);
    const statusLabel = success ? "顺利" : "受阻";

    setStats((currentStats) => ({
      curiosity: Math.min(6, currentStats.curiosity + (delta.curiosity || 0)),
      fear: Math.min(6, currentStats.fear + (delta.fear || 0)),
      timeStatic: Math.min(6, currentStats.timeStatic + (delta.timeStatic || 0)),
    }));
    setLastRoll(roll);
    setCheckModal({ action: pendingChoice.label, checkName: check.name, dc: check.dc, roll, bonus, total, statusLabel, resultText, timeLabel });
    setLog((currentLog) => [
      ...currentLog,
      { who: "骰子", text: mode === "搭建" ? `${check.name}检定：d20 = ${roll}，加值 ${bonus >= 0 ? "+" : ""}${bonus}，合计 ${total}，对抗 DC ${check.dc}，${statusLabel}。` : `${check.name}检定：d20 = ${roll}，${bonus !== 0 ? `加值 ${bonus >= 0 ? "+" : ""}${bonus}，合计 ${total}，` : ""}${statusLabel}。`, timeLabel },
      { who: "主持人", text: resultText, timeLabel },
      { who: "主持人", text: nextNode.text, timeLabel },
    ]);
    setCurrentId(nextNode.id);
    setPendingChoice(null);
    setRollInput("");
    setRollError("");
  }

  function closeCheckModal() {
    setCheckModal(null);
    if (!window.matchMedia("(max-width: 1024px)").matches) return;
    window.setTimeout(() => {
      storyTextRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  const navProps = {
    mode,
    activeChapter,
    hoveredChapter,
    chapterMenuOpen,
    openChapterMenu,
    scheduleCloseChapterMenu,
    closeChapterMenu,
    setHoveredChapterId,
    onPageOne: returnToPageOne,
    onSelectNode: selectNodeFromMenu,
    onCreator: enterBuildMode,
    onReturnPlay: () => setMode("游玩"),
    onSoundLab: onOpenSoundLab,
  };

  if (!hasStarted) {
    return (
      <>
        {showBuildGate && (
          <BuildGateModal
            buildPassword={buildPassword}
            buildPasswordError={buildPasswordError}
            setBuildPassword={setBuildPassword}
            setBuildPasswordError={setBuildPasswordError}
            submitBuildPassword={submitBuildPassword}
            onCancel={() => setShowBuildGate(false)}
          />
        )}
        <StartScreen abilities={abilities} setAbilities={setAbilities} onStart={() => setHasStarted(true)} navProps={navProps} />
      </>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.18),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,.10),transparent_26%),linear-gradient(135deg,#020617,#07111f_45%,#020617)] px-4 pb-4 pt-0 text-slate-100 md:px-6 md:pb-6 md:pt-0">
      {showBuildGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/50">
            <div className="text-xs uppercase tracking-[0.24em] text-sky-100/60">creator gate</div>
            <h2 className="mt-2 text-2xl font-semibold">进入搭建模式</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">请输入创作者密码。</p>
            <input
              value={buildPassword}
              onChange={(event) => {
                setBuildPassword(event.target.value);
                setBuildPasswordError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitBuildPassword();
                if (event.key === "Escape") setShowBuildGate(false);
              }}
              autoFocus
              type="password"
              placeholder="密码"
              className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-200/50"
            />
            {buildPasswordError && <p className="mt-2 text-sm text-rose-200">{buildPasswordError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowBuildGate(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 hover:bg-white/10">
                取消
              </button>
              <button type="button" onClick={submitBuildPassword} className="rounded-2xl bg-sky-200 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-100">
                进入
              </button>
            </div>
          </div>
        </div>
      )}
      <CheckResultModal check={checkModal} onClose={closeCheckModal} />
      <MobileGlobalDrawer
        open={mobileDrawerOpen}
        activeTab={mobileDrawerTab}
        setActiveTab={setMobileDrawerTab}
        onClose={() => setMobileDrawerOpen(false)}
        displayedLog={displayedLog}
        log={log}
        logOrder={logOrder}
        setLogOrder={setLogOrder}
        localNow={localNow}
        mode={mode}
        lastRoll={lastRoll}
        abilities={abilities}
        abilityTotal={abilityTotal}
        statBars={statBars}
        node={node}
      />

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto flex max-w-[1500px] flex-col gap-4">
        <HardNavBar {...navProps} started />

        <div className="xl:hidden">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-slate-950/65 px-4 text-sm font-semibold text-slate-100 shadow-lg shadow-black/20 backdrop-blur transition hover:bg-white/10"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-200/15 text-sky-100">
              <svg viewBox="0 0 18 18" aria-hidden="true" className="h-4 w-4">
                <path d="M4 5H14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M4 9H14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M4 13H14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            总览
          </button>
        </div>

        <header className="mt-2 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[2.15rem] font-semibold leading-tight tracking-tight">KNOCK BACK / 敲回去</h1>
          </div>
        </header>

        <main className="grid gap-4 xl:grid-cols-[0.9fr_1.35fr_0.95fr]">
          <Panel className="hidden min-h-[720px] p-4 xl:block">
            <LogPanelContent displayedLog={displayedLog} log={log} logOrder={logOrder} setLogOrder={setLogOrder} localNow={localNow} />
          </Panel>

          <Panel className="relative min-h-[720px] overflow-hidden p-5">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="relative flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-amber-100/60">当前场景节点</div>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">{node.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{node.scene}</p>
                </div>
                <div className="flex h-8 items-center justify-end gap-1 leading-none text-[10px] text-slate-400">
                  <div className="flex h-4 w-5 items-end gap-[1.5px]">
                    {[4, 7, 10, 13].map((height) => (
                      <span key={height} className="w-[2.5px] rounded-full bg-slate-400/70" style={{ height: `${height}px` }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="relative h-[10px] w-[18px] rounded-[3px] border border-slate-400/70">
                      <span className="absolute left-[2px] top-[2px] h-[4px] w-[3px] rounded-sm bg-amber-200" />
                      <span className="absolute -right-[3px] top-[3px] h-[4px] w-[2px] rounded-r-sm bg-slate-400/70" />
                    </span>
                    <span>17%</span>
                  </div>
                  <span className="pl-1 tabular-nums text-slate-300">{sceneTimeLabel}</span>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[0.45fr_1.55fr]">
                <SceneMotif nodeId={node.id} active={doorActive} tags={node.atmosphere} />
                <div ref={storyTextRef} className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                  <div>
                    <div className="mb-3 text-xs uppercase tracking-[0.24em] text-sky-100/50">{node.location}</div>
                    <p className="text-lg leading-8 text-slate-100/95">{node.text}</p>
                    <div className="my-5 rounded-2xl border border-amber-200/20 bg-amber-200/5 p-4">
                      <div className="mb-1 text-[10px] uppercase tracking-[0.24em] text-amber-100/60">关键物件</div>
                      <div className="font-medium leading-7 text-amber-50">{Array.isArray(node.object) ? node.object.map((line) => <div key={line}>{line}</div>) : node.object}</div>
                    </div>
                    <p className="text-sm leading-6 text-slate-300/80">{node.hint}</p>
                  </div>
                </div>
              </div>

              {pendingChoice && pendingCheck && (
                <div className="rounded-3xl border border-violet-200/25 bg-violet-200/[0.07] p-5 shadow-[0_0_30px_rgba(167,139,250,.10)]">
                  <div className="mb-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-violet-100/70">等待骰子判定</div>
                    <p className="mt-2 text-2xl font-semibold leading-8">{pendingChoice.label}</p>
                    <p className="mt-1 text-sm text-slate-300">{mode === "搭建" ? `${pendingCheck.name}检定 · DC ${pendingCheck.dc}` : `${pendingCheck.name}检定 · 掷 d20`}</p>
                  </div>
                  <div className="mx-auto w-full max-w-[420px] space-y-3">
                    <label className="block">
                      <span className="mb-1.5 block text-xs text-slate-400">骰点</span>
                      <input
                        value={rollInput}
                        onChange={(event) => {
                          setRollInput(event.target.value);
                          setRollError("");
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") resolveRoll();
                        }}
                        placeholder="输入 1-20"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-100 outline-none focus:border-amber-200/50"
                      />
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_72px]">
                      <button type="button" onClick={randomRoll} className="h-11 rounded-2xl border border-violet-200/30 bg-violet-200/10 text-sm font-semibold text-violet-100 hover:bg-violet-200/15">
                        🎲 掷 d20
                      </button>
                      <button type="button" onClick={resolveRoll} className="h-11 rounded-2xl bg-amber-200 text-sm font-semibold text-slate-950 hover:bg-amber-100">
                        确认结果
                      </button>
                      <button type="button" onClick={cancelRoll} className="h-11 rounded-2xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10">
                        取消
                      </button>
                    </div>
                    <p className="text-center text-xs leading-5 text-slate-400">使用浏览器安全随机；也可手动输入实体骰点。</p>
                  </div>
                  {rollError && <p className="mt-3 text-center text-sm text-rose-200">{rollError}</p>}
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                {node.choices.map((choice) => {
                  const check = getCheck(choice);
                  return (
                    <button key={choice.label} type="button" onClick={() => choose(choice)} disabled={Boolean(pendingChoice)} className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-left transition hover:border-amber-200/40 hover:bg-amber-100/10 disabled:cursor-not-allowed disabled:opacity-45">
                      <span className="flex items-center gap-3">
                        <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-amber-100 group-hover:bg-amber-100/15">{choice.icon}</span>
                        <span className="font-medium">{choice.label}</span>
                      </span>
                      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-slate-400">{mode === "搭建" ? `${check.name} DC ${check.dc}` : `${check.name}检定`}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Panel>

          <Panel className="hidden min-h-[720px] p-4 xl:block">
            <CharacterPanelContent mode={mode} lastRoll={lastRoll} abilities={abilities} abilityTotal={abilityTotal} statBars={statBars} node={node} />
          </Panel>
        </main>
      </div>
    </div>
  );
}
