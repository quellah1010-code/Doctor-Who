# KNOCK BACK — 选项扩充
## 第一轮：场景 1-A 至 2-B

---

## 场景 1-A｜洗衣店门口

> 灯管一明一灭。洗衣液在地上淌，蓝色的。你妈穿着睡袍站在中间，抱着毛巾篮，整个人像准备和宇宙决斗。

**原有选项：3 个 → 扩充至 6 个**

---

```json
{
  "label": "冲过去站到妈妈身边",
  "intent": "关系类 —— 第一反应是保护她",
  "noCheck": true,
  "smoothText": "你踩着洗衣液冲过去，差点摔倒，站定在她旁边。Jackie 的手攥紧了毛巾篮，看了你一眼，没说话，但肩膀松了一点。你们背对背面对这间疯狂的洗衣店。",
  "blockedText": null,
  "next": "1-B",
  "flagsAdd": ["jackie_not_alone"],
  "statsDelta": { "胆量": 1 },
  "record": ""
}
```

```json
{
  "label": "先停下来，扫一眼整个洗衣店",
  "intent": "观察类 —— 搞清楚局面再动",
  "check": { "ability": "感知", "dc": 10 },
  "noCheck": false,
  "smoothText": "你在门口停了一秒，强迫自己看：洗衣机成排在震，但不是乱的——最里面那台没有衣服，但内灯亮着。其他机器都有。那台是空的，但在响。你记住了这个。",
  "blockedText": "你想停下来看，但灯光太乱，机器太吵，你什么都没看出来，只是被声音淹了一秒。Jackie 喊你，你冲进去。",
  "next": "1-B",
  "flagsAdd": ["spotted_empty_machine"],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "直奔最里面那台机器",
  "intent": "冒险类 —— 直觉告诉你问题在那里",
  "noCheck": true,
  "smoothText": "你绕过 Jackie，踩着洗衣液直接走向最里面那台。它是空的，但内灯亮着。Jackie 在你后面喊了一句，但你已经到了。",
  "blockedText": null,
  "next": "1-C",
  "flagsAdd": [],
  "statsDelta": {},
  "record": "note: Jackie 没有第一时间站在你身边，她的状态初始值更不稳定。"
}
```

```json
{
  "label": "站在门口，先听",
  "intent": "克制类 —— 不冲进去，先用耳朵判断",
  "check": { "ability": "感知", "dc": 11 },
  "noCheck": false,
  "smoothText": "你强迫自己站着不动，听：烘干机是随机的，洗衣机是随机的——但最里面那台是有节奏的。三下，停，三下，停。不像机器故障。像有人在敲。",
  "blockedText": "太吵了。所有声音砸在一起，你分不清哪个是哪个。Jackie 叫你，你冲进去。",
  "next": "1-B",
  "flagsAdd": ["heard_rhythm"],
  "statsDelta": { "感知加值": 1 },
  "record": ""
}
```

```json
{
  "label": "检查地上的洗衣液",
  "intent": "观察类 —— 看流向，判断异常位置",
  "check": { "ability": "感知", "dc": 12 },
  "noCheck": false,
  "smoothText": "洗衣液往里流，不是往门口。像地面在倾斜，但地面没有倾斜。液体在往最里面那台机器方向聚集，慢的，像被吸过去。这不是重力。",
  "blockedText": "你低头看了一眼，只看到蓝色的一片，什么都判断不出来。",
  "next": "1-B",
  "flagsAdd": ["liquid_flows_inward"],
  "statsDelta": { "机智加值": 1 },
  "record": ""
}
```

```json
{
  "label": "大声叫她的名字",
  "intent": "关系类 —— 先确认她还好",
  "noCheck": true,
  "smoothText": "\"Mum！\" Jackie 猛地转身，认出你，表情从白转红，她骂了你一句找多久了，但你听得出来那是在控制自己的眼眶。",
  "blockedText": null,
  "next": "1-B",
  "flagsAdd": ["jackie_saw_you_first"],
  "statsDelta": {},
  "record": ""
}
```

---
**扩充说明**：
- 新增"停在门口先听"和"检查洗衣液"提供不同的信息探索路径，分别解锁 `heard_rhythm` 和 `liquid_flows_inward` flag，供后续节点调用。
- "大声叫她名字"是纯关系类，不给信息，但软化 Jackie 的初始状态。
- "直奔里面"保留为冒险选项，但明确标注代价：Jackie 落后，状态初始值不稳定。

---

## 场景 1-B｜Jackie 的话

> "里面。" 她指着最里面那台洗衣机。声音很稳，但手在抖。
>
> 那台机器是空的。
>
> 滚筒里有人敲门。三下。

**原有选项：3 个 → 扩充至 6 个**

---

```json
{
  "label": "站到她和洗衣机之间",
  "intent": "克制类 —— 用身体挡住她和门之间的距离",
  "noCheck": true,
  "smoothText": "你走过去，背对洗衣机，面对 Jackie。她抬头看你，眼神里有火也有怕。但她没有往前走。",
  "blockedText": null,
  "next": "1-C",
  "flagsAdd": ["body_between"],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "问她发生了什么",
  "intent": "关系类 —— 先搞清楚她经历了什么",
  "noCheck": true,
  "smoothText": "Jackie 深吸一口气，说话很快：洗衣机开始响，然后里面传出你的声音。她没开门，但快了。她停下来，像要骂自己。你说没关系。",
  "blockedText": null,
  "next": "1-C",
  "flagsAdd": ["jackie_told_you"],
  "statsDelta": { "感知加值": 1 },
  "record": "note: 知道了她几乎开门这件事，后续说服她时机智检定 DC-1。"
}
```

```json
{
  "label": "走近，看滚筒里面",
  "intent": "观察类 —— 正面观察",
  "check": { "ability": "感知", "dc": 12 },
  "noCheck": false,
  "smoothText": "你贴近玻璃门往里看。里面确实是空的，但玻璃内侧有雾气，从里面呵出来的，像有东西在呼吸。你不知道这是什么，但你知道它不是你。",
  "blockedText": "玻璃反光太强，加上灯管在闪，你什么都没看清楚。只有敲门声，三下，又三下。",
  "next": "1-C",
  "flagsAdd": ["saw_breath_fog"],
  "statsDelta": { "机智加值": 1 },
  "record": ""
}
```

```json
{
  "label": "检查其他洗衣机是否也有异常",
  "intent": "观察类 —— 判断这是孤立事件还是整体威胁",
  "check": { "ability": "感知", "dc": 10 },
  "noCheck": false,
  "smoothText": "你快速扫了一眼其他机器：都在转，都有衣服，都是随机的噪音。只有这一台是空的，只有这一台有节奏。威胁是定点的。这让你稍微安静了一点。",
  "blockedText": "太乱了，你看不出差别。所有机器都像在尖叫。",
  "next": "1-C",
  "flagsAdd": ["threat_is_localized"],
  "statsDelta": { "冷静": 1 },
  "record": ""
}
```

```json
{
  "label": "握住她的手",
  "intent": "关系类 —— 不说话，先建立接触",
  "noCheck": true,
  "smoothText": "你伸手握住她的手。Jackie 没有躲，反手握紧了。你们就这样站着，面对那台机器。",
  "blockedText": null,
  "next": "1-C",
  "flagsAdd": ["holding_hands"],
  "statsDelta": {},
  "record": "note: holding_hands flag 激活时，第三下敲门倒计时阶段 Jackie 介入速度更快。"
}
```

```json
{
  "label": "不动，等它再敲一次",
  "intent": "克制类 —— 观察节奏，不被第一下带着走",
  "check": { "ability": "冷静", "dc": 10 },
  "noCheck": false,
  "smoothText": "你站着，等。洗衣机又敲了三下，然后里面的声音来了：你自己的声音，软的，在发抖。你注意到它先敲，后说话。你记住了这个顺序。",
  "blockedText": "你想等，但Jackie往前迈了一步，你本能地跟上去拦她，节奏被打断。",
  "next": "1-C",
  "flagsAdd": ["noted_knock_first"],
  "statsDelta": {},
  "record": "note: noted_knock_first flag 激活时，规则一在 1-D 显示时有额外一行：\"You already noticed.\""
}
```

---
**扩充说明**：
- "不动等它再敲"是规则前置：玩家在规则出现之前，如果足够克制，能自己发现"它先敲"这个核心规则。TARDIS 来信时会给一句认可。
- `holding_hands` flag 不影响检定，但影响 Jackie 的响应速度，在第三幕体现。
- "检查其他洗衣机"给的是冷静加值，不是信息——威胁是定点的这个判断本身就是一种稳定。

---

## 场景 1-C｜第一次敲门

> *"Mum. Please. It's cold."*
>
> Jackie 往前迈了一步。

**⚠️ 关键决策一。玩家此时没有规则。**

**原有选项：4 个 → 扩充至 7 个**

---

```json
{
  "label": "拦住她，不让她碰",
  "intent": "克制类 —— 身体阻断",
  "check": { "ability": "胆量", "dc": 8 },
  "noCheck": false,
  "smoothText": "你一把拽住 Jackie，拉到你身后。她想反抗，但你没松手。\"Don't you say no to me when something's crying with your voice!\" 但她停了。你们都停在原地，面对那台空洗衣机。",
  "blockedText": "你伸手去拦，但犹豫了半秒，Jackie 的手已经碰到了门把手。她还没拉，但碰到了。你赶紧抓住她手腕。",
  "next": "1-D",
  "flagsAdd": [],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "握住她的手腕，不动，看她的眼睛",
  "intent": "关系类 —— 不命令她，用接触拉回她",
  "check": { "ability": "冷静", "dc": 9 },
  "noCheck": false,
  "smoothText": "你抓住她的手腕，不说话，只是看着她。Jackie 停了下来。她深呼了一口气，慢慢从那个声音里回来。\"那不是你，\"她说，像在说服自己。",
  "blockedText": "你抓住她手腕，但她拉了一下，你没拦住，她的手碰到了门把手，停在那里没动。",
  "next": "1-D",
  "flagsAdd": ["jackie_pulled_back_gently"],
  "statsDelta": { "冷静": 1 },
  "record": ""
}
```

```json
{
  "label": "贴近门，仔细听",
  "intent": "观察类 —— 用耳朵判断真假",
  "check": { "ability": "感知", "dc": 13 },
  "noCheck": false,
  "smoothText": "你贴近玻璃，认真听。那个声音很像你——但太像了。没有换气，没有口水声，没有停顿前的那一点犹豫。这是你的声音，但不是你在说话。你知道了。",
  "blockedText": "你贴近去听，那个声音是你的。你几乎被它说服了，心里有一瞬间真的以为——但 Jackie 叫了你一声，你回来了。",
  "next": "1-D",
  "flagsAdd": ["heard_uncanny_valley"],
  "statsDelta": { "机智加值": 1 },
  "record": ""
}
```

```json
{
  "label": "先自己敲三下玻璃，看它怎么反应",
  "intent": "规则类 —— 测试，不是回应",
  "check": { "ability": "机智", "dc": 10 },
  "noCheck": false,
  "smoothText": "你敲了三下。里面的声音停了。一秒，两秒——然后它又叫了一声你妈妈，但节奏不对了，像它在重新找位置。它没有敲回来。你记住了这个。",
  "blockedText": "你敲了三下。里面的声音也停了。然后所有洗衣机同时震了一下，Jackie 后退，你也后退。",
  "next": "1-D",
  "flagsAdd": ["tested_knock"],
  "statsDelta": {},
  "record": "note: tested_knock 激活时，1-D 中 TARDIS 规则三显示后，额外一行：\"You already tested it.\""
}
```

```json
{
  "label": "什么都不做，看 Jackie 怎么反应",
  "intent": "克制类 —— 观察，不干预",
  "check": { "ability": "冷静", "dc": 10 },
  "noCheck": false,
  "smoothText": "你站着，看她。Jackie 往前走了一步，手伸出来，停在空气里——然后她自己退回去了，眼神在洗衣机和你之间来回，像在重新想这件事。",
  "blockedText": "你等着，但 Jackie 已经往前走了两步，手碰到了门把手。你赶紧扑过去。",
  "next": "1-D",
  "flagsAdd": [],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "对她说：那不是我",
  "intent": "关系类 —— 直接说出来",
  "noCheck": true,
  "smoothText": "\"Mum. That's not me. I'm right here.\" Jackie 转头看你，看你的脸，然后看洗衣机，再看你。她往后退了一步，手放下来。声音还在叫，但她不动了。",
  "blockedText": null,
  "next": "1-D",
  "flagsAdd": ["told_her_directly"],
  "statsDelta": {},
  "record": "note: told_her_directly 激活时，Jackie 在第三幕部署阶段同意得更快。"
}
```

```json
{
  "label": "拉开洗衣机门",
  "intent": "冒险类 —— 直接看里面有什么",
  "noCheck": true,
  "smoothText": null,
  "blockedText": null,
  "next": "branch_open_door",
  "flagsAdd": ["opened_door"],
  "statsDelta": { "胆量": -2, "冷静": -2 },
  "record": "开了门。"
}
```

---
**扩充说明**：
- 原版 C"什么都不做"保留，但给了冷静检定而不是纯观察，因为意图是"克制自己不动"。
- 新增"先自己敲三下"：玩家可以在没有规则的情况下自己发现"复制品不会敲回来"。这是规则三的前置发现，TARDIS 来信时会有认可。
- "对她说那不是我"是最直接的关系选项，没有检定，但会改变 Jackie 在第三幕的响应速度。
- 7 个选项里覆盖了：关系×2，观察×1，克制×2，规则×1，冒险×1。

---

## 场景 1-D｜TARDIS 来信

> 屏幕上慢慢浮出一行白字：
> **IF IT KNOCKS FIRST, DO NOT OPEN.**
> 第二行：**KNOCK BACK.**

**原有选项：3 个 → 扩充至 6 个**

---

```json
{
  "label": "敲洗衣机玻璃门，三下",
  "intent": "规则类 —— 按指令执行",
  "noCheck": true,
  "smoothText": "你敲了三下。里面的声音停了。一秒，然后所有机器同时敲回你，整齐，清晰——洗衣机，烘干机，厕所门，找零机。每一扇门都从里面敲了三下。",
  "blockedText": null,
  "next": "2-A",
  "flagsAdd": ["first_knock_back"],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "仔细看手机屏幕，等它还有没有更多",
  "intent": "观察类 —— 不急着行动，先读完信息",
  "check": { "ability": "机智", "dc": 9 },
  "noCheck": false,
  "smoothText": "你盯着屏幕不动。过了几秒，第三行浮出来：**IT WILL USE VOICES. REAL PEOPLE KNOCK BACK.** 然后消失，像从来没出现过。你记住了。",
  "blockedText": "你等着，屏幕没有新信息，只剩 KNOCK BACK 停在那里。",
  "next": "1-D",
  "flagsAdd": ["read_extra_line"],
  "statsDelta": { "机智加值": 1 },
  "record": "note: read_extra_line 激活时，规则三出现时有额外一行认可文本。"
}
```

```json
{
  "label": "把手机给妈妈看",
  "intent": "关系类 —— 让她自己看，不是替她解读",
  "noCheck": true,
  "smoothText": "你把手机递给 Jackie。她凑过去读，嘴唇动了一下，然后把手机还给你，说：\"Box is texting now. Fine.\" 她的声音很平，但你看到她把毛巾篮放下来了——她腾出了手。",
  "blockedText": null,
  "next": "1-D",
  "flagsAdd": ["jackie_read_herself"],
  "statsDelta": {},
  "record": "note: jackie_read_herself 激活时，Jackie 在 3-A 说服场景的冷静状态+1。"
}
```

```json
{
  "label": "问 TARDIS：Doctor 在哪里",
  "intent": "规则类 —— 在行动前先确认 Doctor 的状态",
  "check": { "ability": "机智", "dc": 11 },
  "noCheck": false,
  "smoothText": "你在手机上打字：Where is he。屏幕上浮出一行：**INSIDE. HE HEARD SOMETHING. HE KNEW IT WASN'T REAL. HE WENT IN ANYWAY. NOW HE IS HOLDING THE DOOR SHUT.**",
  "blockedText": "你在手机上打字，但没有回应。屏幕只停着 KNOCK BACK。",
  "next": "1-D",
  "flagsAdd": ["knows_doctor_went_in"],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "让妈妈来敲",
  "intent": "关系类 —— 让她主动参与，而不是被保护",
  "noCheck": true,
  "smoothText": "Jackie 二话不说，拿起衣架，走向洗衣机，敲了三下玻璃，然后对着滚筒说：\"If my daughter was trapped in a washing machine, she'd say this thing's too small.\" 洗衣机里的声音停了。",
  "blockedText": null,
  "next": "2-A",
  "flagsAdd": ["jackie_knocked", "jackie_knows"],
  "statsDelta": {},
  "record": "Jackie 自己想通了。"
}
```

```json
{
  "label": "试着给 Doctor 发信息",
  "intent": "冒险类 —— 绕过 TARDIS 直接联系他",
  "check": { "ability": "机智", "dc": 13 },
  "noCheck": false,
  "smoothText": "你试着发信息给 Doctor。没有送达，但手机屏幕闪了一下，出现一行不是 TARDIS 风格的字体，乱码了半秒，然后稳定成：**I HEAR YOU. WORKING ON IT. DO NOT OPEN THE BLUE DOOR YET.**",
  "blockedText": "没有送达。信号为零，消息没有出去。手机屏幕只剩 KNOCK BACK。",
  "next": "1-D",
  "flagsAdd": ["doctor_heard_you"],
  "statsDelta": {},
  "record": "note: doctor_heard_you 激活时，2-D 场景中 Doctor 开口时第一句话变为：\"I heard you. Good.\""
}
```

---
**扩充说明**：
- "仔细看手机"是观察类但不是感知——是机智，因为意图是读懂而不是察觉。
- "让妈妈来敲"保留原来的效果（Jackie 解锁 knows 状态），但现在放在 1-D 而不是单独分支。
- "试着给 Doctor 发信息"是风险选项，成功解锁一个 Doctor 视角的隐藏信息，失败只是什么都没发生，不惩罚。

---

## 场景 2-A｜墙裂开了

> 洗衣店侧墙裂开。一扇蓝色的门从墙里挤出来。不是完整的 TARDIS。只有一扇门，嵌在墙上，蓝漆湿得像刚从雨里来过。
>
> 门牌上写着：**PULL TO OPEN.**
>
> 蓝门从里面敲了三下。

**原有选项：3 个 → 扩充至 6 个**

---

```json
{
  "label": "问 TARDIS：他在哪里",
  "intent": "规则类 —— 先获取情报",
  "check": { "ability": "机智", "dc": 9 },
  "noCheck": false,
  "smoothText": "手机一行一行显示：**INSIDE. HE HEARD SOMETHING. HE KNEW IT WASN'T REAL. HE WENT IN ANYWAY.** 最后一行慢出来：**NOW HE IS HOLDING THE DOOR SHUT.**",
  "blockedText": "手机只出来两行：**INSIDE. HOLDING.** 没有更多。",
  "next": "2-B",
  "flagsAdd": ["knows_doctor_went_in"],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "贴近蓝门，听里面的声音",
  "intent": "观察类 —— 用耳朵判断门后有什么",
  "check": { "ability": "感知", "dc": 11 },
  "noCheck": false,
  "smoothText": "你靠近门板，贴耳去听。里面不是安静，是很多扇门叠在一起的声音——开了又关，关了又开，像一座走廊在折叠自己。然后在最深处，你听见了他的脚步声。他在跑。",
  "blockedText": "你靠近门板，什么都没听见。门是冷的，冷得像深水。",
  "next": "2-B",
  "flagsAdd": ["heard_him_running"],
  "statsDelta": {},
  "record": "note: heard_him_running 激活时，2-D Doctor 开口时你多一句：\"I could hear you running.\""
}
```

```json
{
  "label": "敲蓝门三下",
  "intent": "规则类 —— 确认里面是真人",
  "noCheck": true,
  "smoothText": "你敲了三下。停了一秒。然后门里敲回三下——急、重，带着那种没耐心的节奏。是他。",
  "blockedText": null,
  "next": "2-B",
  "flagsAdd": ["confirmed_real_knock"],
  "statsDelta": { "胆量": 1 },
  "record": "note: confirmed_real_knock 激活时，玩家在 2-D 第一次听见 Doctor 声音时多一行内心旁白：\"那个节奏是他的。你认得出。\""
}
```

```json
{
  "label": "把 TARDIS key 插进锁孔",
  "intent": "冒险类 —— 直接尝试开门",
  "check": { "ability": "胆量", "dc": 12 },
  "noCheck": false,
  "smoothText": "钥匙插进去，门像被烫了，蓝漆下浮出金色裂纹，发出低沉的警告声。手机亮起：**NOT YET. RULES FIRST.**",
  "blockedText": "你伸手去拿钥匙，但手停住了——门太冷了，冷得不像木头。你没能把钥匙拿出来。",
  "next": "2-B",
  "flagsAdd": [],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "先把妈妈拉离那扇门",
  "intent": "克制类 —— 先确保她安全，再处理门",
  "check": { "ability": "冷静", "dc": 8 },
  "noCheck": false,
  "smoothText": "你拉着 Jackie 退到洗衣店中间，离蓝门保持距离。她没有反抗，站稳了，看着你。你们两个面对那扇门，背后是普通的机器，前面是不该在这里的东西。",
  "blockedText": "你想拉她退后，但 Jackie 往前站了一步，朝着那扇门看。你只能跟上去站到她旁边。",
  "next": "2-B",
  "flagsAdd": ["jackie_is_back"],
  "statsDelta": { "冷静": 1 },
  "record": ""
}
```

```json
{
  "label": "检查蓝门门牌和门框",
  "intent": "观察类 —— 看细节，判断这扇门是真实的还是伪装的",
  "check": { "ability": "感知", "dc": 9 },
  "noCheck": false,
  "smoothText": "门牌是真的警察亭门牌，漆面磨损的方式是对的，铆钉位置是对的。不是复制品——这是真的门，只是不应该在墙里。蓝漆上有一点水，像刚从雨里来过。",
  "blockedText": "你看了一眼，看不出什么，只知道它是蓝的，是木的，上面写着 PULL TO OPEN。",
  "next": "2-B",
  "flagsAdd": ["door_is_real"],
  "statsDelta": { "机智加值": 1 },
  "record": "note: door_is_real 激活时，2-D 里 Doctor 确认是他时，你的内心旁白变为：\"你早就知道了。\""
}
```

---
**扩充说明**：
- "敲蓝门三下"是本场景最重要的新增：规则三说真人能敲回来，玩家此时可以自己验证 Doctor 是不是真的在里面。这是一个主动使用规则的机会，给胆量+1，并解锁后续认知。
- "检查门牌和门框"是观察类，但用意是区分"真实的 TARDIS 门"和"怪物造出来的门"。结果是门是真的，这消除一个悬念，同时给机智加值。
- `heard_him_running` 和 `confirmed_real_knock` 两个 flag 在 2-D 都有台词变体。

---

## 场景 2-B｜Mickey 进场 & 规则

> Mickey 冲进来，踩到洗衣液，差点飞进烘干机。
>
> 厕所门里传出 Mickey 的声音。Mickey 本人停住了。
>
> 手机显示三条规则，显示后消失。

**原有选项：3 个 → 扩充至 6 个**

---

```json
{
  "label": "立刻告诉 Mickey 不要开任何门",
  "intent": "克制类 —— 第一时间管住他",
  "noCheck": true,
  "smoothText": "\"Mickey, don't open anything.\" 他举起球棒，环顾四周，脸色不太好。\"Do I look like I want to?\" 但他停住了，没有乱动。",
  "blockedText": null,
  "next": "2-C",
  "flagsAdd": ["mickey_briefed"],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "用规则二核对：Mickey 本人在这里",
  "intent": "规则类 —— 主动使用刚学到的规则",
  "noCheck": true,
  "smoothText": "你看 Mickey 本人，再看厕所门。Mickey 本人站在你面前，湿漉漉的，手里有球棒。厕所里的声音在叫你，但叫的方式不对——是问句，不是行动。你说：\"That's not you in there.\" Mickey 炸了：\"I do not sound like that.\"",
  "blockedText": null,
  "next": "2-C",
  "flagsAdd": ["mickey_knows_rule"],
  "statsDelta": { "机智加值": 1 },
  "record": "note: mickey_knows_rule 激活时，Mickey 在 3-B 部署阶段不需要额外解释，直接接受任务。"
}
```

```json
{
  "label": "让 Mickey 去砸厕所门",
  "intent": "冒险类 —— 主动告诉它闭嘴",
  "noCheck": true,
  "smoothText": "\"Hit it.\" Mickey 立刻抡球棒砸过去，门凹进去一块，里面的声音尖了，变成很多声音叠在一起的东西。Mickey 后退：\"It doesn't like that.\" 你说：\"Because you didn't open it. You just told it to shut up.\"",
  "blockedText": null,
  "next": "2-C",
  "flagsAdd": ["hit_the_door"],
  "statsDelta": {},
  "record": ""
}
```

```json
{
  "label": "让 Mickey 现在就去守前门",
  "intent": "关系类 —— 给他一个具体任务，让他不乱动",
  "noCheck": true,
  "smoothText": "\"Mickey, front door. Lock it, block it, don't let anything in or out.\" Jackie 把一串钥匙扔给他，他接住，点头，跑去前门，手忙脚乱地锁门、搬椅子顶住。有事做了，他反而稳了。",
  "blockedText": null,
  "next": "2-C",
  "flagsAdd": ["mickey_at_front"],
  "statsDelta": {},
  "record": "note: mickey_at_front 激活时，3-B 部署阶段前门已经有人守，玩家少一个部署步骤。"
}
```

```json
{
  "label": "把规则告诉 Mickey，逐条解释",
  "intent": "关系类 —— 让他真正理解，而不只是服从",
  "check": { "ability": "机智", "dc": 10 },
  "noCheck": false,
  "smoothText": "你快速说了规则：先敲不能开，听见认识的人要确认，真人能敲回来假的只会问。Mickey 点头，样子像听懂了一半，但他说：\"So the thing in the toilet only asked, it didn't knock.\" 他自己想通了。",
  "blockedText": "你说得太快，Mickey 只听进去了一条。他还是举着球棒，不确定该做什么。",
  "next": "2-C",
  "flagsAdd": ["mickey_understands"],
  "statsDelta": {},
  "record": "note: mickey_understands 激活时，厕所假 Mickey 再叫时，Mickey 本人会自己说：\"Rule three. It's asking, not knocking.\""
}
```

```json
{
  "label": "测试厕所里的声音：敲厕所门三下",
  "intent": "规则类 —— 验证假 Mickey",
  "check": { "ability": "胆量", "dc": 10 },
  "noCheck": false,
  "smoothText": "你走向厕所门，敲了三下。里面停了一秒，然后——它没有敲回来。它说：\"Rose, please.\" 还是问句。规则三。Mickey 本人在你旁边小声说：\"Did it just fail a test?\"",
  "blockedText": "你走向厕所门，举起手，但停住了。里面的 Mickey 声音叫了一声你的名字，你没敲。",
  "next": "2-C",
  "flagsAdd": ["tested_fake_mickey"],
  "statsDelta": { "机智加值": 1 },
  "record": "note: tested_fake_mickey 激活时，2-C 里 Jackie 问 Doctor 在哪里时，Mickey 会插嘴：\"I know how to test them now.\""
}
```

---
**扩充说明**：
- "测试假 Mickey"是本场景最有密度的新增：玩家第一次在有规则的情况下主动测试规则三，亲自验证"复制品只问不敲"。这是玩家从被动接受规则变成主动使用规则的第一步，也为 3-A 的"Jackie 作为锚点"埋下认知基础。
- `mickey_at_front` 提前部署 Mickey，减少 3-B 的部署步骤，让玩家感受到早期决策对后续节奏的影响。
- `mickey_understands` 给 Mickey 一个主动使用规则的台词时刻，让他不只是搞笑工具。

---

## Flags 汇总表（1-A 至 2-B）

| flag | 触发节点 | 影响 |
|------|---------|------|
| `jackie_not_alone` | 1-A | Jackie 初始冷静+1 |
| `spotted_empty_machine` | 1-A | 1-C 感知检定 DC-1 |
| `heard_rhythm` | 1-A | 1-D TARDIS 规则一出现时有认可文本 |
| `liquid_flows_inward` | 1-A | 解锁一行环境细节描述 |
| `jackie_told_you` | 1-B | 3-A 说服检定 DC-1 |
| `saw_breath_fog` | 1-B | 确认复制品有物理存在 |
| `threat_is_localized` | 1-B | 玩家冷静+1 |
| `holding_hands` | 1-B | 第三幕 Jackie 介入速度+1 |
| `noted_knock_first` | 1-B | TARDIS 规则一时有认可 |
| `heard_uncanny_valley` | 1-C | 机智加值+1 |
| `tested_knock` | 1-C | TARDIS 规则三时有认可 |
| `jackie_pulled_back_gently` | 1-C | Jackie 状态：知道了 |
| `told_her_directly` | 1-C | 3-A 说服同意更快 |
| `opened_door` | 1-C | 进入困难分支 |
| `read_extra_line` | 1-D | 规则三认可 |
| `jackie_read_herself` | 1-D | 3-A 冷静+1 |
| `knows_doctor_went_in` | 1-D / 2-A | 2-D 有额外反应 |
| `doctor_heard_you` | 1-D | 2-D Doctor 第一句话变体 |
| `heard_him_running` | 2-A | 2-D 台词变体 |
| `confirmed_real_knock` | 2-A | 2-D 内心旁白变体 |
| `door_is_real` | 2-A | 2-D 内心旁白变体 |
| `jackie_is_back` | 2-A | 冷静+1 |
| `mickey_briefed` | 2-B | Mickey 状态：稳定 |
| `mickey_knows_rule` | 2-B | 3-B 部署不需额外解释 |
| `mickey_at_front` | 2-B | 3-B 少一个部署步骤 |
| `mickey_understands` | 2-B | 假 Mickey 再出现时 Mickey 有台词 |
| `tested_fake_mickey` | 2-B | 机智加值+1，2-C Mickey 有插嘴 |
| `jackie_knocked` / `jackie_knows` | 1-D | Jackie 状态：主动 |
