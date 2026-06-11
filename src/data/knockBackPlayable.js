const defaultAudio = ["三下敲门", "洗衣机低鸣", "TARDIS 引擎卡顿"];
const defaultBuild = ["沿用旧 D&D 玩法", "不改整体视觉", "后续再拆正式 data/flags"];

function notes(purpose, variables = []) {
  return {
    purpose,
    interactions: ["选择行动", "掷 d20", "显示顺利 / 受阻", "写入跑团记录并推进下一节点"],
    variables: variables.length ? variables : ["关键选择先写进记录", "复杂 flags 下一轮再接"],
    audio: defaultAudio,
    build: defaultBuild,
  };
}

function choice(label, next, ability, dc, smoothText, blockedText, smoothDelta = {}, blockedDelta = {}, icon = "→") {
  return {
    label,
    next,
    icon,
    check: { ability, dc },
    smoothText,
    blockedText,
    smoothDelta,
    blockedDelta,
  };
}

function node({ id, title, scene, location, atmosphere, text, object, hint, choices, purpose, variables }) {
  return {
    id,
    title,
    scene,
    location,
    atmosphere,
    text,
    object,
    hint,
    choices,
    notes: notes(purpose, variables),
  };
}

export const nodes = {
  "laundrette-door": node({
    id: "laundrette-door",
    title: "洗衣店在尖叫",
    scene: "第 01 幕 · 洗衣店门口",
    location: "Powell Estate 附近的自助洗衣店",
    atmosphere: ["BAD WOLF", "蓝色洗衣液", "灯管闪烁", "Jackie"],
    text: "Father's Day 当晚，Doctor 把你送回 Powell Estate。TARDIS 声音消失后，你妈发来短信：Where are you. Milk. Now. 你买完牛奶回来，经过墙上新划着 BAD WOLF 的洗衣店，然后听见里面在尖叫。",
    object: "Jackie 穿着睡袍站在洗衣店中间，抱着一篮毛巾。最里面那台洗衣机是空的，却从滚筒里传出三下敲门声。",
    hint: "你还没有规则，只有声音、灯光、和你妈发白的脸。",
    choices: [
      choice("冲过去站到妈妈身边", "jackie-warning", "胆量", 8, "你踩着洗衣液冲过去，站定在 Jackie 身旁。她的肩膀松了一点。", "你差点滑倒，但还是冲到她旁边。场面更乱了，可 Jackie 至少知道你在这里。", { curiosity: 1 }, { fear: 1 }, "◆"),
      choice("先扫一眼整个洗衣店", "jackie-warning", "感知", 10, "你看出只有最里面那台机器是空的。它在按节奏敲：三下，停，再三下。", "灯太乱，机器太吵，你只看到蓝色洗衣液铺满地面。", { curiosity: 1, timeStatic: 1 }, { fear: 1 }, "◌"),
      choice("直奔最里面那台机器", "first-knock", "胆量", 10, "你直接到了那台机器前。它空着，内灯亮着，里面像有人正贴着玻璃呼吸。", "你冲得太快，Jackie 落在你身后。你到了机器前，但身后少了一点现实感。", { curiosity: 1, timeStatic: 1 }, { fear: 1, timeStatic: 1 }, "→"),
    ],
    purpose: "开场节点：把 Father’s Day 余波、Jackie、洗衣机敲门和 BAD WOLF 放到同一个压力场里。",
  }),

  "jackie-warning": node({
    id: "jackie-warning",
    title: "Jackie 的话",
    scene: "第 01 幕 · 滚筒里的三下",
    location: "洗衣店中段",
    atmosphere: ["毛巾篮", "三下敲门", "你的声音", "妈妈的手在抖"],
    text: "Jackie 指着最里面那台洗衣机。她的声音很稳，但手在抖。那台机器是空的。滚筒里有人敲门，三下。",
    object: "从空荡荡的滚筒里，传出你的声音：Mum, open the door.",
    hint: "声音太像你了。太像了，反而不对。",
    choices: [
      choice("站到她和洗衣机之间", "first-knock", "胆量", 8, "你站到 Jackie 和洗衣机之间。她还想往前，但你没让开。", "你挡住了大半步，但 Jackie 的手已经伸出去了。", {}, { fear: 1 }, "挡"),
      choice("问她发生了什么", "first-knock", "冷静", 9, "Jackie 快速说：里面先敲，然后用你的声音求她开门。她没开，但她差一点就开了。", "你开口问，但机器又敲了三下，Jackie 被声音拖着往前迈了一步。", { curiosity: 1 }, { fear: 1 }, "?"),
      choice("走近看滚筒里面", "first-knock", "感知", 12, "玻璃内侧起了一层雾，像有什么东西在里面呼吸。你知道它不是你。", "玻璃反光太强，你只看见自己的脸和 Jackie 的脸叠在一起。", { curiosity: 1, timeStatic: 1 }, { fear: 1 }, "目"),
      choice("握住她的手", "first-knock", "冷静", 8, "你握住 Jackie 的手。她反手握紧，像从那个声音里回来了一点。", "你拉住了她，但没完全拉回来。", {}, { fear: 1 }, "手"),
    ],
    purpose: "关系节点：让 Jackie 不只是被保护对象，而是之后能成为现实锚点的人。",
    variables: ["Jackie 稳定度", "玩家是否先理解敲门顺序"],
  }),

  "first-knock": node({
    id: "first-knock",
    title: "第一次敲门",
    scene: "第 01 幕 · Mum, please",
    location: "最里面那台洗衣机前",
    atmosphere: ["你的声音", "请开门", "没有规则", "危险选择"],
    text: "滚筒里的声音变小，像在发抖：Mum. Please. It's cold. Jackie 的脸白了，她往前迈了一步。",
    object: "洗衣机门把手就在她手边。你还不知道规则，只知道如果这真是你，她会开门。",
    hint: "这是第一个关键决定。开门不会立刻结束故事，但会让后面更难。",
    choices: [
      choice("拦住妈妈，不让她碰", "tardis-text", "胆量", 8, "你拦住 Jackie。她愤怒又害怕，但没有碰门。", "你慢了半秒，她的手碰到门把手，但还没拉开。", {}, { fear: 1 }, "挡"),
      choice("贴近门仔细听", "tardis-text", "感知", 13, "声音太平滑了，没有换气、没有犹豫。这是你的声音，但不是你。", "它真的太像你了。你几乎被说服，直到 Jackie 叫了你一声。", { curiosity: 1 }, { fear: 1 }, "耳"),
      choice("自己敲三下玻璃测试", "tardis-text", "机智", 10, "你敲了三下。里面停住了，却没有敲回来。它只是换了个语气继续请求。", "所有机器同时震了一下。你得到答案，也付出了一点恐惧。", { curiosity: 1, timeStatic: 1 }, { fear: 1, timeStatic: 1 }, "扣"),
      choice("拉开洗衣机门", "opened-door", "胆量", 14, "你打开了门。里面是空的。然后洗衣液开始逆着重力流进滚筒。", "你打开了门。灯全灭，Jackie 的声音忽然从门的另一边传来。", { fear: 1, timeStatic: 2 }, { fear: 2, timeStatic: 2 }, "开"),
    ],
    purpose: "第一关键决策。玩家没有规则，只能凭关系、观察和胆量做选择。",
    variables: ["opened_door", "是否测试过敲门", "Jackie 是否稳住"],
  }),

  "opened-door": node({
    id: "opened-door",
    title: "门被打开",
    scene: "第 01 幕 · 困难分支",
    location: "洗衣机门后",
    atmosphere: ["太迟了", "逆流", "TARDIS 警告", "困难模式"],
    text: "门后是空的。然后洗衣液开始往滚筒里流，逆着重力，像有人在另一边喝。整间洗衣店的灯同时亮到刺眼，然后全灭。",
    object: ["DO NOT OPEN WHAT KNOCKS FIRST.", "BUT YOU ALREADY KNEW THAT.", "KNOCK BACK. BOTH OF YOU."],
    hint: "开门不是终止结局。它只是让房间更快学会你们的反应。",
    choices: [choice("承认已经出事，照 TARDIS 说的做", "tardis-text", "冷静", 12, "你把恐惧按下去。已经开过的门不能关回无事发生，但你还能敲回去。", "你花了一秒才稳住自己。那一秒里，机器学会了你害怕什么。", { timeStatic: 1 }, { fear: 1, timeStatic: 1 }, "扣")],
    purpose: "早期开门后的回主线节点。它不惩罚玩家出局，只把故事压力抬高。",
    variables: ["branchMode = breached", "后续复制品更主动"],
  }),

  "tardis-text": node({
    id: "tardis-text",
    title: "TARDIS 来信",
    scene: "第 01 幕 · KNOCK BACK",
    location: "手机锁屏 · NO SERVICE",
    atmosphere: ["无信号", "白字", "规则一", "敲回去"],
    text: "你的手机亮了。没有信号，没有网络。黑色锁屏上慢慢浮出一行白字：IF IT KNOCKS FIRST, DO NOT OPEN. 第二行随后出现：KNOCK BACK.",
    object: ["IF IT KNOCKS FIRST, DO NOT OPEN.", "KNOCK BACK."],
    hint: "TARDIS 没有解释太多。它只给你一条能活下去的规则。",
    choices: [
      choice("敲洗衣机玻璃门，三下", "blue-door", "胆量", 8, "你敲了三下。所有机器同时安静，然后整齐地敲回你。", "你敲得有点乱，但机器还是听见了。它们一起敲回来。", { curiosity: 1, timeStatic: 1 }, { fear: 1, timeStatic: 1 }, "扣"),
      choice("先等手机还有没有更多信息", "blue-door", "机智", 9, "第三行浮出来：IT WILL USE VOICES. REAL PEOPLE KNOCK BACK. 你记住了。", "屏幕没有新信息，只剩 KNOCK BACK 停在那里。你只能照做。", { curiosity: 1 }, { fear: 1 }, "▣"),
      choice("让 Jackie 来敲", "blue-door", "冷静", 8, "Jackie 拿衣架敲了三下，然后说：如果我女儿被困在洗衣机里，她第一句绝不会是 please，她会说这里太小。", "Jackie 敲得太用力，玻璃发出刺耳的响声。但她敲了，而且她懂了一点。", { curiosity: 1 }, { fear: 1 }, "手"),
      choice("问 TARDIS：Doctor 在哪里", "blue-door", "机智", 11, "手机显示：INSIDE. HE HEARD SOMETHING. HE KNEW IT WASN'T REAL. HE WENT IN ANYWAY. NOW HE IS HOLDING THE DOOR SHUT.", "手机只显示：INSIDE. HOLDING. 信息不全，但足够坏。", { curiosity: 1 }, { fear: 1 }, "?"),
    ],
    purpose: "规则出现节点。玩家从恐怖现场进入可推理的 D&D 规则场。",
    variables: ["规则一", "规则三前置", "Doctor 在里面"],
  }),

  "blue-door": node({
    id: "blue-door",
    title: "墙裂开了",
    scene: "第 02 幕 · 蓝色的门",
    location: "洗衣店侧墙",
    atmosphere: ["砖灰落下", "蓝漆湿亮", "PULL TO OPEN", "Doctor absent"],
    text: "你敲了三下。整间洗衣店安静了一秒，然后所有能开合的东西都敲回三下。侧墙裂开，一扇蓝色的门从墙里挤出来。不是完整的 TARDIS，只有一扇门。",
    object: "门牌写着 PULL TO OPEN。蓝门从里面敲了三下。手机又震了：THE DOCTOR IS ABSENT.",
    hint: "这扇门像真的 TARDIS，又不应该只剩一扇门。",
    choices: [
      choice("问 TARDIS：他在哪里", "mickey-rules", "机智", 9, "手机显示：他在里面，听见了某个不真实的声音，却还是进去了。现在他正从另一边顶住门。", "手机只给你两个词：INSIDE. HOLDING. 这已经够让人不安了。", { curiosity: 1 }, { fear: 1 }, "?"),
      choice("贴近蓝门听里面声音", "mickey-rules", "感知", 11, "你听见很多门开开关关，然后在最深处，有人在跑。那个急促节奏是 Doctor。", "门太冷了，像深水。你什么都没听见，只觉得它不想让你靠近。", { curiosity: 1, timeStatic: 1 }, { fear: 1 }, "耳"),
      choice("敲蓝门三下确认真人", "mickey-rules", "胆量", 10, "你敲三下。门里马上敲回三下，急、重、不耐烦。是他。", "你敲下去，门里迟了一秒才回应。还是三下，但那一秒让你心口发冷。", { curiosity: 1 }, { fear: 1 }, "扣"),
      choice("先把妈妈拉离那扇门", "mickey-rules", "冷静", 8, "你把 Jackie 拉回洗衣店中间。她没有反抗，这次你们都离门远了一点。", "Jackie 盯着那扇门，你只能跟上去站到她旁边。", {}, { fear: 1 }, "手"),
    ],
    purpose: "蓝门登场。把规则从洗衣机扩展到所有门，并确认 Doctor 被困在另一侧。",
  }),

  "mickey-rules": node({
    id: "mickey-rules",
    title: "Mickey 进场与三条规则",
    scene: "第 02 幕 · 规则显示",
    location: "洗衣店前门",
    atmosphere: ["球棒", "厕所门", "假 Mickey", "三条规则"],
    text: "前门被猛地推开，Mickey Smith 冲进来，头发全湿，拿着球棒。厕所门里立刻传出 Mickey 的声音：Rose? You in there? Mickey 本人停住了。",
    object: ["RULE ONE: IF IT KNOCKS FIRST, DO NOT OPEN.", "RULE TWO: IF YOU HEAR SOMEONE YOU LOVE, CHECK THE ROOM.", "RULE THREE: A REAL PERSON CAN KNOCK BACK. A COPY CAN ONLY ASK."],
    hint: "规则显示后就消失。接下来要靠你记住。",
    choices: [
      choice("立刻告诉 Mickey 不要开任何门", "doctor-jackie", "冷静", 8, "Mickey 举着球棒，看了一圈门，脸色发绿：Do I look like I want to? 但他停住了。", "你喊得太急，Mickey 还是朝厕所门走了半步。你及时拦住他。", {}, { fear: 1 }, "!"),
      choice("核对：Mickey 本人在这里", "doctor-jackie", "感知", 9, "你看 Mickey 本人，再看厕所门。你说：That's not you. Mickey 炸了：I do not sound like that.", "你知道厕所里的不是他，但说出口慢了一点，Mickey 已经紧张起来。", { curiosity: 1 }, { fear: 1 }, "目"),
      choice("让 Mickey 去砸厕所门", "doctor-jackie", "胆量", 10, "Mickey 一球棒砸过去，里面的声音尖了，变成很多声音叠在一起。它不喜欢被拒绝。", "Mickey 砸偏了，门没开，但里面的声音笑了一下。它学得更快了。", { curiosity: 1 }, { fear: 1, timeStatic: 1 }, "棒"),
      choice("让 Mickey 现在去守前门", "doctor-jackie", "机智", 10, "你给 Mickey 一个具体任务。他跑去锁门、搬椅子顶住门。有事做了，他反而稳了。", "Mickey 去守门，但一路还在回头看厕所门。你知道他没有完全听懂规则。", {}, { fear: 1 }, "门"),
    ],
    purpose: "规则教学节点。Mickey 把外部现实带进来，也给后面部署做准备。",
  }),

  "doctor-jackie": node({
    id: "doctor-jackie",
    title: "Jackie 问 Doctor 在哪",
    scene: "第 02 幕 · 亲密关系压力测试",
    location: "蓝门和洗衣机之间",
    atmosphere: ["Doctor absent", "Jackie", "Mickey 守门", "声音学习"],
    text: "Jackie 问：Where's the Doctor? 没人立刻回答。蓝门又敲了三下。你说他在里面。他听见了什么，知道那不是真的，但还是进去了。",
    object: "Jackie 的脸变了一点，像她认出了那种“明知不是真的也要确认”的声音。",
    hint: "Doctor 和 Jackie 都会被声音拉住。你要决定怎么稳住现实。",
    choices: [
      choice("让 Jackie 留在你身边", "doctor-voice", "冷静", 9, "你让 Jackie 留在你身边。她嘴上不服，但没有走开。", "Jackie 没走，但她一直盯着蓝门，像随时会冲过去。", {}, { fear: 1 }, "手"),
      choice("让 Mickey 守前门，你和 Jackie 对付 TARDIS", "doctor-voice", "机智", 10, "部署开始有形状了：Mickey 守前门，Jackie 留在现实里说话，你负责蓝门。", "部署勉强成形，但每个人都还在问为什么偏偏是自己。", { curiosity: 1 }, { fear: 1 }, "门"),
      choice("先跟 TARDIS 沟通 Doctor 的位置", "doctor-voice", "机智", 10, "TARDIS 显示：Doctor 听得见你们，但走廊已经移位。他需要时间。", "TARDIS 只显示：GIVE HIM TIME. 你不知道他还剩多少时间。", { curiosity: 1, timeStatic: 1 }, { fear: 1 }, "▣"),
    ],
    purpose: "第二幕过渡。把规则压力从门转到人：Doctor、Jackie、Mickey 分别承担现实的一部分。",
  }),

  "doctor-voice": node({
    id: "doctor-voice",
    title: "Doctor 开口",
    scene: "第 02 幕 · Mostly",
    location: "蓝门后",
    atmosphere: ["急促呼吸", "Doctor 声音", "Mostly", "别开门"],
    text: "蓝门后传出 Doctor 的声音：Rose, don't open the door! 他听起来非常近，气喘、急促，还带着那种烦躁又兴奋的调子。",
    object: ["Did you open anything?", "No!", "Good.", "Are you trapped?", "Trapped implies I didn't choose to be here.", "Did you?", "…Mostly."],
    hint: "这不是判断他真假的难题。你已经知道他是真的。问题是他在里面听见了什么。",
    choices: [
      choice("不追问，直接让他到门边", "jackie-anchor", "冷静", 9, "你没有追问。Doctor 立刻说：Working on it. 节奏稳住了。", "你忍住没问，但沉默太明显。Doctor 也听出来了。", {}, { fear: 1 }, "→"),
      choice("问他在里面听见了什么", "jackie-anchor", "感知", 12, "Doctor 沉默两秒，说：Doesn't matter. Get your mum. 他不回答，但你知道他听见的是很久以前的东西。", "你问出口，门后安静了一拍。Doctor 没回答，只更急地让你找 Jackie。", { curiosity: 1 }, { fear: 1 }, "?"),
      choice("只是说：I'm here", "jackie-anchor", "胆量", 10, "Doctor 停了一下，声音低了一点：I know. 然后他恢复正常节奏。", "你说了，声音发抖。门后 Doctor 也听见了，但这句仍然抵达了他。", { curiosity: 1 }, { fear: 1 }, "声"),
    ],
    purpose: "Doctor 节点。给玩家一个不改变主线但改变情绪记录的回应。",
  }),

  "jackie-anchor": node({
    id: "jackie-anchor",
    title: "Jackie 的锚点",
    scene: "第 03 幕 · 让现实说话",
    location: "洗衣店中央",
    atmosphere: ["现实锚点", "母女关系", "Doctor 在门后", "怪物学习"],
    text: "Doctor 在门后说，需要一个固定的现实铰链：情感足够强、又没法被复制品正确模仿的东西。你看向 Jackie。",
    object: "Jackie 皱眉：Is he insulting us?",
    hint: "她差点被骗，是因为她爱你。现在这件事也能成为锚点。",
    choices: [
      choice("直接说计划：让她保持说话", "deployment", "冷静", 10, "Jackie 说她不喜欢这个计划，虽然还没听完。但她没走。", "Jackie 开始反对，需要 Doctor 从门后帮腔。她勉强同意了。", {}, { fear: 1 }, "说"),
      choice("问她：如果真是我会说什么", "deployment", "机智", 8, "Jackie 停了一下，说：如果我女儿被困在洗衣机里，她会说这东西太小。她自己想通了。", "Jackie 看着你，问你是不是打算解释一下现在到底发生什么。", { curiosity: 1 }, { fear: 1 }, "?"),
      choice("什么都不说，等她自己想通", "deployment", "感知", 13, "你等着。Jackie 的眼神变了，她拿起衣架走向洗衣机。她已经知道该做什么。", "你等太久了。Jackie 终于说：Are you going to tell me what's going on?", { curiosity: 1 }, { fear: 1 }, "…"),
    ],
    purpose: "关键决策二。Jackie 不是工具人，她是这个故事的现实锚点。",
  }),

  deployment: node({
    id: "deployment",
    title: "部署",
    scene: "第 03 幕 · 每个人守一扇门",
    location: "洗衣店开始折叠",
    atmosphere: ["前门", "厕所门", "蓝门", "Jackie 说话"],
    text: "Doctor 说：Rose, I'm almost at the other side. When I knock, you knock. Same time. Three times. Jackie keeps talking. Mickey keeps the front door shut.",
    object: "厕所门和前门同时开始用 Mickey 的声音喊：Let me in! Mickey 立刻改口：Actually, very busy here!",
    hint: "倒数开始前，你还有一次调整部署的机会。",
    choices: [
      choice("Mickey 守前门，Jackie 说话，你负责蓝门", "third-knock", "冷静", 9, "标准部署成立。每个人都有位置，洗衣店暂时被现实钉住。", "部署成立得有点乱，但至少每个人知道自己该看哪一扇门。", {}, { fear: 1 }, "位"),
      choice("先测试洗衣机是否还会学习", "third-knock", "感知", 12, "你敲三下，洗衣机没有敲回，只换了一个更像你的语气。它在学习，但还是不会回应。", "你敲下去，洗衣机里的声音安静了一秒。你不知道这是进展还是它在记住你。", { curiosity: 1 }, { timeStatic: 1 }, "扣"),
      choice("让 Jackie 先说几句测试它", "third-knock", "机智", 10, "复制品学不会 Jackie 的混乱逻辑。它能借声音，却借不到她的活人反应。", "复制品模仿了一点 Jackie 的音色，Jackie 勃然大怒。这也算一种稳定。", { curiosity: 1 }, { fear: 1 }, "声"),
    ],
    purpose: "最终行动前的战术节点。用旧 D&D 的一次检定代表部署质量。",
  }),

  "third-knock": node({
    id: "third-knock",
    title: "第三下",
    scene: "第 03 幕 · Pete 的声音",
    location: "蓝门前",
    atmosphere: ["医院走廊", "厨房", "Henrik's", "Pete Tyler"],
    text: "洗衣店开始变形。厨房、地下室、医院走廊从各个圆形门后往外挤。蓝门后传来第一下敲门声。你敲回去。第二下。你跟上。",
    object: "就在第三下前，洗衣机里传出 Pete Tyler 的声音：Rose? Sweetheart?",
    hint: "所有门同时往外开了一点。Jackie 的脸色变了。Doctor 的声音也停住了。",
    choices: [
      choice("敲第三下", "door-releases", "胆量", 14, "你敲了第三下。声音落下，TARDIS 像终于咬回自己的边界。", "你的手停住了。Jackie 抓住你的手腕，带着你的拳头一起敲在蓝门上。Jackie knocked for you.", { timeStatic: 1 }, { fear: 1, timeStatic: 1 }, "扣"),
      choice("回头看那台洗衣机", "door-releases", "冷静", 16, "你回头，但没有走向它。洗衣机里没有 Pete，只有一个等你开门的形状。你还是敲了第三下。", "你失去了时机。Jackie 介入，带着你的手敲下第三下。Jackie knocked for you.", { curiosity: 1 }, { fear: 1, timeStatic: 1 }, "目"),
      choice("叫 Doctor 先敲", "door-releases", "冷静", 16, "你喊：Doctor, third knock. Jackie 也对着门喊他。门后传来一声：Still here. 你们同时敲下第三下。", "你喊了，没有回应。Jackie 介入，替你把第三下敲完。", {}, { fear: 1 }, "声"),
    ],
    purpose: "关键决策三。Pete 的声音不是谜题答案，而是情绪压力。受阻时 Jackie 介入，不是惩罚。",
  }),

  "door-releases": node({
    id: "door-releases",
    title: "第三下落下",
    scene: "第 03 幕 · 门吐出 Doctor",
    location: "裂开的蓝门",
    atmosphere: ["金色光", "TARDIS 边界", "洗衣粉", "Jackie 爆炸"],
    text: "第三下落下的瞬间，TARDIS 发出巨大的轰鸣。洗衣机里的手缩回去，厨房、地下室、医院走廊全部被拽回各自的圆形门后。",
    object: "蓝门打开一条缝。Doctor 从里面挤出来，外套乱得像被一百扇门同时打过，手里拿着冒烟的小装置。",
    hint: "他一出来先回头踹了门框一脚，然后问：Right, who opened the washing machine? Jackie 爆炸了。",
    choices: [
      choice("先确认 Doctor 没事", "laundrette-epilogue", "感知", 9, "他嘴上说当然没事，但你看出他停过一下。他在里面也听见了某个声音。", "他把所有问题都用话盖过去。你知道他在躲，但这会儿没有追。", { curiosity: 1 }, { fear: 1 }, "医"),
      choice("先抱住 Jackie", "laundrette-epilogue", "冷静", 8, "Jackie 愣了一下，然后抱回你，比平时紧。", "你们差点撞到一桶洗衣粉，但还是抱住了。", {}, { fear: 1 }, "手"),
      choice("问谁来解释这一地洗衣粉", "laundrette-epilogue", "机智", 8, "Mickey 坚持自己贡献很大。Doctor 说这不算损坏，Jackie 说这当然算。", "没人笑得特别自然，但至少大家都还在这里。", { curiosity: 1 }, {}, "笑"),
    ],
    purpose: "高潮落点。怪物退去，人物关系开始收束。",
  }),

  "laundrette-epilogue": node({
    id: "laundrette-epilogue",
    title: "洗衣店天快亮了",
    scene: "尾声 · 裂开的砖墙",
    location: "恢复正常的洗衣店",
    atmosphere: ["天快亮", "墙还没修好", "Doctor 不说实话", "Rose 很累"],
    text: "混乱慢慢安静下来。蓝门从墙里消失，只剩裂开的砖墙。Doctor 开始修，Jackie 说这不算修好，Doctor 说这很有结构完整性。",
    object: "Doctor 走到你身边，没有看你，只看墙。你说：You stopped. In there. You stopped. 他说：I heard... 然后停住了。",
    hint: "有些声音不是假的就不痛。它借来的东西仍然会让人回头。",
    choices: [
      choice("问他听见了什么", "jackie-goodbye", "感知", 12, "Doctor 说：Something I thought was gone. Turns out it just waits. 然后他不再说了。", "Doctor 没回答，只说：Doesn't matter what. 但他的沉默已经回答了一半。", { curiosity: 1 }, { fear: 1 }, "?"),
      choice("只说：你也为我敲了", "jackie-goodbye", "冷静", 8, "Doctor 说：You knocked for me first. You 回答：Still counts.", "你说出口时声音很轻。Doctor 没反驳，只看了你一眼。", {}, { fear: 1 }, "扣"),
    ],
    purpose: "战斗后的情绪落点。把 Doctor 的停顿和 Rose 的疲惫放出来。",
  }),

  "jackie-goodbye": node({
    id: "jackie-goodbye",
    title: "Jackie 和告别",
    scene: "尾声 · 多留一秒",
    location: "洗衣店门口",
    atmosphere: ["牛奶还在", "睡袍", "嘴硬", "拥抱"],
    text: "Rose 走过去抱了 Jackie 一下。Jackie 愣住，然后抱回去，比平时紧。她说：You call me after this. Not TARDIS texting. You. Personally.",
    object: "TARDIS 方向传来很轻的一声嗡鸣，像在催，也像在等。",
    hint: "这不是选择留下还是离开。是离开之前要不要再多留一秒。",
    choices: [
      choice("直接走向 Doctor 和 TARDIS", "tardis-epilogue", "胆量", 8, "你转身走向 Doctor。Jackie 看着你，没拦。", "你走了两步又停了一下。Jackie 看见了，但没有说破。", { curiosity: 1 }, { fear: 1 }, "→"),
      choice("走之前再抱一下 Jackie", "tardis-epilogue", "冷静", 8, "Jackie 眼睛有点湿，但嘴是硬的：Go on, then. 你多留了一秒。", "你抱得太突然，Jackie 差点骂你，但最后还是抱回来了。", {}, { fear: 1 }, "手"),
    ],
    purpose: "人间锚点的收束。这里的选择不判好坏，只记录 Rose 留了多久。",
  }),

  "tardis-epilogue": node({
    id: "tardis-epilogue",
    title: "TARDIS 里",
    scene: "尾声 · 礼貌的门",
    location: "控制室",
    atmosphere: ["干净引擎声", "三下回应", "Pete 的声音", "NO SUCH PLACE"],
    text: "Rose 走到 TARDIS 门前，轻轻敲了三下。里面没有怪物，没有借来的声音，没有陷阱。TARDIS 从里面敲回三下。",
    object: "你告诉 Doctor：It used my dad's voice. I knew it wasn't him. But for a second, I really...",
    hint: "Doctor 没有打断。他说：It borrowed it. That's all. 但他也知道那感觉不止这样。",
    choices: [
      choice("问：Does it get easier?", "end-records", "冷静", 10, "Doctor 没有立刻说会。他说：You stop expecting it to knock. Takes a while.", "你问出口后，控制室安静了很久。Doctor 最后说：Takes a while.", {}, { fear: 1 }, "?"),
      choice("说：Somewhere with no doors", "end-records", "机智", 8, "TARDIS 屏幕浮出：NO SUCH PLACE. Doctor 看了一会儿，笑了：Fine. Somewhere with polite doors.", "TARDIS 震了一下表示反对。Doctor 还是笑了：Somewhere with polite doors, then.", { curiosity: 1 }, {}, "门"),
    ],
    purpose: "最终情绪节点。Father’s Day 的伤口不被治好，只被温柔地命名。",
  }),

  "end-records": node({
    id: "end-records",
    title: "记录，没有评级",
    scene: "结算页 · 没有分数",
    location: "时间漩涡边缘",
    atmosphere: ["没有评级", "只有记录", "一声轻响", "门仍在"],
    text: "TARDIS 冲进时间漩涡。安静几秒后，控制室深处某扇内部的门轻轻响了一下。不是三下。一下。Doctor 说那只是白噪音，TARDIS 的灯没有闪。",
    object: ["你拦住过 Jackie，或她拦住过你。", "你敲过第三下，或 Jackie 替你敲了。", "你多留了一秒，或者把那一秒带进了 TARDIS。", "没有分数。没有评级。只有记录。"],
    hint: "你看向那扇门的方向，没有说话。",
    choices: [
      choice("从洗衣店门口重新开始", "laundrette-door", "冷静", 8, "故事重新回到 BAD WOLF 墙边。你已经知道门会敲，但 Rose 还不知道。", "时间绕了一下，还是把你带回洗衣店门口。", { curiosity: 1 }, { timeStatic: 1 }, "↺"),
      choice("回到 TARDIS 尾声", "tardis-epilogue", "感知", 8, "你回到控制室那盏没有闪的灯前。", "你回到控制室，但那扇内部的门又轻轻响了一下。", {}, { fear: 1 }, "↩"),
    ],
    purpose: "结算节点。旧玩法先不做复杂勾选表，只在文本里收束所有记录。",
  }),
};

export const chapterGroups = [
  { id: "page-01", label: "Page 1", title: "序章 / 角色准备", page: "start", nodeIds: [] },
  { id: "act-01", label: "第 01 幕", title: "尖叫的洗衣店", nodeIds: ["laundrette-door", "jackie-warning", "first-knock", "opened-door", "tardis-text"] },
  { id: "act-02", label: "第 02 幕", title: "蓝色的门", nodeIds: ["blue-door", "mickey-rules", "doctor-jackie", "doctor-voice"] },
  { id: "act-03", label: "第 03 幕", title: "第三下", nodeIds: ["jackie-anchor", "deployment", "third-knock", "door-releases"] },
  { id: "epilogue", label: "尾声", title: "记录，没有评级", nodeIds: ["laundrette-epilogue", "jackie-goodbye", "tardis-epilogue", "end-records"] },
];

export const maxAbilityTotal = 5;
export const maxSingleAbility = 3;
export const fullIntroMessage = ["WHERE ARE YOU. MILK. NOW.", "BAD WOLF.", "THE LAUNDRETTE IS SCREAMING."].join(String.fromCharCode(10));
export const initialAbilities = { 感知: 0, 机智: 0, 胆量: 0, 冷静: 0 };
export const initialLog = [
  { who: "主持人", text: "Father's Day 当晚，TARDIS 把 Rose 送回 Powell Estate。" },
  { who: "主持人", text: "Jackie 发来短信：Where are you. Milk. Now." },
  { who: "系统", text: "模组已载入：KNOCK BACK / 敲回去" },
];
