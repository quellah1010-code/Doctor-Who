import React, { useEffect, useMemo, useRef, useState } from "react";

const nodes = {
  door: {
    id: "door",
    title: "Rose 推开的那扇门",
    scene: "第 01 幕 · 打烊后的商场通道",
    location: "地下员工通道",
    atmosphere: ["外面在下雨", "灯管嗡鸣", "不该出现的门", "无信号"],
    text: "走廊的灯闪了一下。尽头那面本该是水泥墙的地方，立着一扇蓝色木门。它太旧了，不像属于这座商场；它又太安静了，像一直在等某个人终于注意到它。",
    object: "门把手上方贴着一张白纸，上面写着：PULL TO OPEN。",
    hint: "你的手机自己亮了。电量 17%。无服务。没有发件人的未读短信，正静静躺在屏幕中央。",
    choices: [
      { label: "贴近门听一听", next: "listen", icon: "◌" },
      { label: "查看手机", next: "phone", icon: "▣" },
      { label: "拉开这扇门", next: "pull", icon: "▯" },
      { label: "后退一步", next: "stepback", icon: "←" },
    ],
    notes: {
      purpose: "玩家第一次遇见“不可能存在的门”，并决定要承认多少好奇心。",
      interactions: ["先选择行动，再进入骰子判定", "玩家可手动输入 d20 点数，也可随机掷骰", "判定成功/失败会写入跑团记录并推进节点"],
      variables: ["调查时：好奇心 +1", "后退失败时：恐惧 +2", "触碰门把手时：时间静电明显上升"],
      audio: ["老旧灯管的电流嗡鸣", "通风口里隐约的雨声", "门后低沉的机械呼吸声"],
      build: ["不需要插画", "蓝门是纯 CSS 元素", "剧情节点写在可编辑 JSON 里"],
    },
  },
  listen: {
    id: "listen",
    title: "门也在听你",
    scene: "第 01A 幕 · 耳朵贴上木门",
    location: "同一条通道",
    atmosphere: ["模糊人声", "旧电视静电", "温热的木头", "屏住呼吸"],
    text: "你把耳朵贴上蓝色木门。门后没有房间。那里有风声、机器声，还有一个女人的声音，从几十年的静电噪声里穿过来。她叫出了你的名字，语气像是忍了很久才终于开口。",
    object: "门的另一边回应了三下敲击。停顿。两下。再三下。",
    hint: "那个声音不像是在邀请你进去，更像是在确认：你是不是已经听见了。",
    choices: [
      { label: "敲回去", next: "pull", icon: "▯" },
      { label: "查看手机", next: "phone", icon: "▣" },
      { label: "退回走廊", next: "door", icon: "←" },
    ],
    notes: {
      purpose: "调查分支。让玩家意识到这扇门不是死物，它会回应。",
      interactions: ["这是骰子机制最适合出现的节点", "成功时听见更完整的人声片段", "失败时走廊会用玩家自己的声音回应"],
      variables: ["好奇心 +1", "时间静电 +1", "如果玩家敲回去：门的信任 +1"],
      audio: ["木门敲击声", "旧电视雪花屏噪声", "非常远的女性声音"],
      build: ["给门缝加一个很轻的敲击动画", "记录区显示检定结果", "可作为骰子机制的第一个教学点"],
    },
  },
  phone: {
    id: "phone",
    title: "一条没有发件人的短信",
    scene: "第 01B 幕 · 手机屏幕",
    location: "地下员工通道 · 电量 17%",
    atmosphere: ["冰冷玻璃", "屏幕微光", "没有发件人", "不可能的短信"],
    text: "屏幕在你没有触碰它的情况下亮起。无信号。无 Wi‑Fi。无发件人。短信框自己打开，字母一个个浮现出来，像时间另一端有个非常耐心的人正在打字。",
    object: ["ROSE OPENED HERS. NOW IT’S YOUR TURN.", "Rose 打开了她的那扇。现在轮到你了。"],
    hint: "相机应用紧接着自己打开。在取景框里，那扇蓝门已经开了。",
    choices: [
      { label: "拍一张照", next: "stepback", icon: "▣" },
      { label: "拉开这扇门", next: "pull", icon: "▯" },
      { label: "删除短信", next: "door", icon: "×" },
    ],
    notes: {
      purpose: "手机分支。把日常设备变成玩家和时间裂缝之间的接口。",
      interactions: ["手机卡片可以从中间面板滑出", "短信内容用打字机效果出现", "照片预览可以显示未来状态"],
      variables: ["时间静电 +1", "如果拍照：证据 +1", "如果删除短信：恐惧 +1"],
      audio: ["手机震动", "被扭曲的通知音", "反向播放的快门声"],
      build: ["制作纯 CSS 手机小面板", "不需要真实图片，用文字预览即可", "之后可复用为线索 UI"],
    },
  },
  pull: {
    id: "pull",
    title: "裂缝打开了",
    scene: "第 02 幕 · 门槛",
    location: "已经不完全是商场了",
    atmosphere: ["金色光", "内部比外部更大", "机器呼吸", "无法原路返回"],
    text: "门把手比金属更冷，又比皮肤更温热。你向外一拉，门后没有普通房间，而是一片纵深。金色光铺过地面，带着雨水、灰尘、发热电线，以及某个等待太久的地方的气味。",
    object: "里面的墙壁上有一圈圈发光的圆形结构。一座控制台在深处低鸣，像某种努力假装成机器的动物。",
    hint: "你身后的走廊开始一盏灯、一盏灯地消失。",
    choices: [
      { label: "走进去", next: "door", icon: "→" },
      { label: "向里面喊话", next: "listen", icon: "◌" },
      { label: "回头看", next: "stepback", icon: "←" },
    ],
    notes: {
      purpose: "第一次跨过门槛。页面从普通工作台正式转入冒险状态。",
      interactions: ["门缝金光扩散", "中间面板可短暂反色或闪烁", "跑团记录添加“跨越门槛”事件"],
      variables: ["时间静电 +2", "好奇心 +2", "普通世界 -1"],
      audio: ["低沉引擎声", "金色光升起的细碎声", "走廊灯逐个熄灭"],
      build: ["CSS 发光动画", "不使用官方 logo 或原剧完整标识", "这是第一版 demo 的高潮节点"],
    },
  },
  stepback: {
    id: "stepback",
    title: "你已经不能当作没看见了",
    scene: "第 01C 幕 · 尝试离开",
    location: "地下员工通道",
    atmosphere: ["距离变错", "灯光重复", "商场地图改变", "轻微恐慌"],
    text: "你后退一步。很理智。很正常。很像一个人类该做的事。但走廊礼貌地拒绝结束。出口标识还在，只是现在它不再指向出口，而是指向那扇蓝门。",
    object: "地面上，你自己的影子向前伸长，在你之前碰到了门把手。",
    hint: "门还没有打开。但别的东西已经打开了。",
    choices: [
      { label: "跟着自己的影子", next: "pull", icon: "▯" },
      { label: "再听一次", next: "listen", icon: "◌" },
      { label: "查看手机", next: "phone", icon: "▣" },
    ],
    notes: {
      purpose: "拒绝分支。展示“不选择”本身也会产生后果。",
      interactions: ["出口标识文字可 glitch", "影子用 CSS 渐变线条表示", "玩家会知道撤退也有代价"],
      variables: ["恐惧 +2", "时间静电 +1", "好奇心保持未解决状态"],
      audio: ["重复的脚步声", "出口灯牌电流破音", "很轻的心跳声"],
      build: ["适合展示玩家能动性", "不需要美术", "之后可以加入走廊循环视觉"],
    },
  },
};

const chapterGroups = [
  { id: "page-01", label: "Page 1", title: "序章 / 角色准备", page: "start", nodeIds: [] },
  { id: "chapter-01", label: "第 01 幕", title: "打烊后的商场通道", nodeIds: ["door", "listen", "phone", "stepback"] },
  { id: "chapter-02", label: "第 02 幕", title: "门槛", nodeIds: ["pull"] },
];

const maxAbilityTotal = 5;
const maxSingleAbility = 3;
const fullIntroMessage = ["ROSE OPENED HERS.", "NOW IT’S YOUR TURN."].join(String.fromCharCode(10));
const initialAbilities = { 感知: 0, 机智: 0, 胆量: 0, 冷静: 0 };
const initialLog = [
  { who: "主持人", text: "商场已经打烊。雨声从天花板上方的通风口里传来。" },
  { who: "主持人", text: "员工通道尽头，一扇蓝门安静地等在那里，像它一直都在。" },
  { who: "系统", text: "节点已载入：Rose 推开的那扇门" },
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
  return table[choice.next] || { name: "行动", dc: 10, success: "行动成功。", fail: "行动成功，但代价变得更明显。" };
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
          <div className="relative" onMouseEnter={openChapterMenu} onMouseLeave={scheduleCloseChapterMenu}>
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
              <div className="absolute right-0 top-[34px] z-50 flex min-w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="w-40 border-r border-white/10 p-2">
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
                <div className="w-56 p-2">
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

export default function DWDoorWorkbenchMockup({ onOpenSoundLab = () => {} }) {
  const [currentId, setCurrentId] = useState("door");
  const [log, setLog] = useState(initialLog);
  const [mode, setMode] = useState("游玩");
  const [stats, setStats] = useState({ curiosity: 1, fear: 0, timeStatic: 0 });
  const [abilities, setAbilities] = useState(initialAbilities);
  const [logOrder, setLogOrder] = useState("oldest");
  const [localNow, setLocalNow] = useState(() => new Date());
  const [lastRoll, setLastRoll] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
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
    setLastCheck(null);
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
    setLastCheck({ action: choice.label, name: check.name, dc: check.dc, status: "等待掷骰", timeLabel: formatLocalTime(localNow) });
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

    setStats((currentStats) => ({
      curiosity: Math.min(6, currentStats.curiosity + (delta.curiosity || 0)),
      fear: Math.min(6, currentStats.fear + (delta.fear || 0)),
      timeStatic: Math.min(6, currentStats.timeStatic + (delta.timeStatic || 0)),
    }));
    setLastRoll(roll);
    setLastCheck({ action: pendingChoice.label, name: check.name, dc: check.dc, roll, bonus, total, status: success ? "成功" : "失败", resultText, timeLabel });
    setLog((currentLog) => [
      ...currentLog,
      { who: "骰子", text: mode === "搭建" ? `${check.name}检定：d20 = ${roll}，加值 ${bonus >= 0 ? "+" : ""}${bonus}，合计 ${total}，对抗 DC ${check.dc}，${success ? "成功" : "失败"}。` : `${check.name}检定：d20 = ${roll}，${bonus !== 0 ? `加值 ${bonus >= 0 ? "+" : ""}${bonus}，合计 ${total}，` : ""}${success ? "成功" : "失败"}。`, timeLabel },
      { who: "主持人", text: resultText, timeLabel },
      { who: "主持人", text: nextNode.text, timeLabel },
    ]);
    setCurrentId(nextNode.id);
    setPendingChoice(null);
    setRollInput("");
    setRollError("");
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
                <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-5">
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
              <div className="mb-4 rounded-2xl border border-white/10 bg-black/15 p-3 text-sm leading-6 text-slate-300">
                {lastCheck ? (
                  <>
                    <div>
                      行动：<span className="text-slate-100">{lastCheck.action}</span>
                    </div>
                    <div>
                      检定：<span className="text-slate-100">{lastCheck.name}</span>
                      {mode === "搭建" ? ` · DC ${lastCheck.dc}` : ""}
                    </div>
                    <div>
                      状态：<span className="text-amber-100">{lastCheck.status}</span>
                      {lastCheck.roll ? ` · d20 = ${lastCheck.roll}` : ""}
                      {lastCheck.roll && lastCheck.bonus !== 0 ? ` · 加值 ${lastCheck.bonus >= 0 ? "+" : ""}${lastCheck.bonus}` : ""}
                      {lastCheck.roll ? ` · 合计 ${lastCheck.total}` : ""}
                    </div>
                    {lastCheck.timeLabel && (
                      <div>
                        时间：<span className="text-slate-100">{lastCheck.timeLabel}</span>
                      </div>
                    )}
                    {lastCheck.resultText && <div className="mt-2 text-slate-400">{lastCheck.resultText}</div>}
                  </>
                ) : (
                  "先选择一个行动，右侧会出现对应检定。"
                )}
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
