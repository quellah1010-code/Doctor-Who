import React, { useEffect, useMemo, useRef, useState } from "react";
import CheckResultModal from "./components/CheckResultModal.jsx";
import HardNavBar from "./components/HardNavBar.jsx";
import SceneMotif from "./components/SceneMotif.jsx";
import StartScreen from "./components/StartScreen.jsx";
import { chapterGroups, initialAbilities, initialLog, maxAbilityTotal, nodes } from "./data/doorNodes.js";

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

export default function DWDoorWorkbenchMockup({ onOpenSoundLab = () => {} }) {
  const [currentId, setCurrentId] = useState("door");
  const [log, setLog] = useState(initialLog);
  const [mode, setMode] = useState("游玩");
  const [stats, setStats] = useState({ curiosity: 1, fear: 0, timeStatic: 0 });
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
    setCurrentId("door");
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
    const check = getCheck(choice);
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
    const bonus = Number(abilities[check.name]) || 0;
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
    return <StartScreen abilities={abilities} setAbilities={setAbilities} onStart={() => setHasStarted(true)} navProps={navProps} />;
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

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto flex max-w-[1500px] flex-col gap-4">
        <HardNavBar {...navProps} started />

        <header className="mt-2 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[2.15rem] font-semibold leading-tight tracking-tight">Rose 推开的那扇门</h1>
          </div>
        </header>

        <main className="grid gap-4 lg:grid-cols-[0.9fr_1.35fr_0.95fr]">
          <Panel className="min-h-[720px] p-4">
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

          <Panel className="min-h-[720px] p-4">
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
          </Panel>
        </main>
      </div>
    </div>
  );
}
