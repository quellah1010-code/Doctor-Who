import { useEffect, useState } from "react";
import HardNavBar from "./HardNavBar.jsx";
import { fullIntroMessage, initialAbilities, maxAbilityTotal, maxSingleAbility } from "../data/doorNodes.js";

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function getAbilityTotal(abilities) {
  return Object.values(abilities).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

function Panel({ children, className = "" }) {
  return <div className={`rounded-3xl border border-white/10 bg-slate-950/55 shadow-2xl shadow-black/30 backdrop-blur ${className}`}>{children}</div>;
}

export default function StartScreen({ abilities, setAbilities, onStart, navProps }) {
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
              <h1 className="text-[3rem] font-semibold leading-[1.08] tracking-tight">Rose 推开的那扇门</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">商场已经打烊，雨水顺着通风口的边缘往下滴。你只是想穿过员工通道离开，却在本该是水泥墙的地方，看见了一扇蓝色木门。</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">它太旧了，不像属于这座商场；它又太安静了，像一直在等某个人终于注意到它。你的手机亮起，一条没有发件人的短信躺在屏幕中央：</p>
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
              开始进入通道
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
