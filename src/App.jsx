import { useEffect, useRef, useState } from "react";
import DWDoorWorkbenchMockup from "./DWDoorWorkbenchMockup.jsx";
import DWSoundEffectLab from "./DWSoundEffectLab.jsx";

function scrollToStoryTextOnMobile() {
  if (!window.matchMedia("(max-width: 1024px)").matches) return;
  window.setTimeout(() => {
    const marker = Array.from(document.querySelectorAll("div")).find((element) => element.textContent?.trim() === "关键物件");
    const target = marker?.closest(".rounded-3xl");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

function textFrom(element) {
  return element?.textContent?.replace(/\s+/g, "").trim() || "";
}

function getClassName(element) {
  return typeof element?.className === "string" ? element.className : "";
}

function findResolvedCheckCard() {
  return Array.from(document.querySelectorAll("div")).find((element) => {
    const className = getClassName(element);
    const text = textFrom(element);
    return className.includes("rounded-2xl") && text.includes("行动：") && text.includes("检定：") && text.includes("状态：") && text.includes("d20=") && text.includes("合计");
  });
}

function hideInlineCheckCards() {
  Array.from(document.querySelectorAll("div")).forEach((element) => {
    const className = getClassName(element);
    const text = textFrom(element);
    const isCheckCard = className.includes("rounded-2xl") && text.includes("行动：") && text.includes("检定：");
    const isEmptyCheckCard = className.includes("rounded-2xl") && text === "先选择一个行动，右侧会出现对应检定。";
    if (isCheckCard || isEmptyCheckCard) element.style.display = "none";
  });
}

function parseCheckCard(card) {
  const text = textFrom(card);
  const action = text.match(/行动：(.+?)检定：/)?.[1] || "本次行动";
  const checkName = text.match(/检定：(.+?)(?:·DC\d+)?状态：/)?.[1] || "检定";
  const rawStatus = text.match(/状态：(.+?)(?:·|时间：)/)?.[1] || "";
  const roll = text.match(/d20=(\d+)/)?.[1] || "—";
  const bonus = text.match(/加值([+-]?\d+)/)?.[1] || "";
  const total = text.match(/合计(\d+)/)?.[1] || "—";
  const timeLabel = text.match(/时间：(\d{2}:\d{2})/)?.[1] || "";
  const resultText = text.match(/时间：\d{2}:\d{2}(.+)$/)?.[1] || "";
  const statusLabel = rawStatus === "成功" ? "顺利" : rawStatus === "失败" ? "受阻" : rawStatus || "结算";

  return {
    action,
    checkName,
    roll,
    bonus,
    total,
    timeLabel,
    resultText,
    statusLabel,
    signature: `${action}|${checkName}|${rawStatus}|${roll}|${bonus}|${total}|${timeLabel}|${resultText}`,
  };
}

function CheckResultModal({ check, onClose }) {
  if (!check) return null;
  const isBlocked = check.statusLabel === "受阻";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
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
              <h2 className="text-2xl font-semibold tracking-tight">本次检定</h2>
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
            {check.bonus && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">加值</span>
                <span className="font-medium text-slate-100">{check.bonus}</span>
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

export default function App() {
  const [view, setView] = useState("door");
  const [checkModal, setCheckModal] = useState(null);
  const lastCheckSignature = useRef("");

  useEffect(() => {
    if (view !== "door") return undefined;

    function syncCheckModal() {
      hideInlineCheckCards();
      const card = findResolvedCheckCard();
      if (!card) return;
      const check = parseCheckCard(card);
      if (!check.signature || check.signature === lastCheckSignature.current) return;
      lastCheckSignature.current = check.signature;
      setCheckModal(check);
    }

    syncCheckModal();
    const observer = new MutationObserver(syncCheckModal);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [view]);

  function closeCheckModal() {
    setCheckModal(null);
    scrollToStoryTextOnMobile();
  }

  return (
    <>
      {view === "door" ? <DWDoorWorkbenchMockup onOpenSoundLab={() => setView("sound")} /> : <DWSoundEffectLab />}
      <CheckResultModal check={checkModal} onClose={closeCheckModal} />
    </>
  );
}
