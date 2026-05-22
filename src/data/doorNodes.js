export const nodes = {
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
      interactions: ["先选择行动，再进入骰子判定", "玩家可手动输入 d20 点数，也可随机掷骰", "判定顺利/受阻会写入跑团记录并推进节点"],
      variables: ["调查时：好奇心 +1", "后退受阻时：恐惧 +2", "触碰门把手时：时间静电明显上升"],
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
      interactions: ["这是骰子机制最适合出现的节点", "顺利时听见更完整的人声片段", "受阻时走廊会用玩家自己的声音回应"],
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

export const chapterGroups = [
  { id: "page-01", label: "Page 1", title: "序章 / 角色准备", page: "start", nodeIds: [] },
  { id: "chapter-01", label: "第 01 幕", title: "打烊后的商场通道", nodeIds: ["door", "listen", "phone", "stepback"] },
  { id: "chapter-02", label: "第 02 幕", title: "门槛", nodeIds: ["pull"] },
];

export const maxAbilityTotal = 5;
export const maxSingleAbility = 3;
export const fullIntroMessage = ["ROSE OPENED HERS.", "NOW IT’S YOUR TURN."].join(String.fromCharCode(10));
export const initialAbilities = { 感知: 0, 机智: 0, 胆量: 0, 冷静: 0 };
export const initialLog = [
  { who: "主持人", text: "商场已经打烊。雨声从天花板上方的通风口里传来。" },
  { who: "主持人", text: "员工通道尽头，一扇蓝门安静地等在那里，像它一直都在。" },
  { who: "系统", text: "节点已载入：Rose 推开的那扇门" },
];
