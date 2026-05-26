# KNOCK BACK Logic Chain Draft

来源分支：knock-back-source-docs

本文件目的：先把下午塞进去的全文、关键节点、1-A 到 2-B 交互整理成逻辑链。这个分支只做文档，不改 React、不改 UI、不改 Vite、不改 GitHub Pages 配置。

## 实施边界

- main 的 GitHub Pages base 继续保持 /Doctor-Who/。
- 不合入 knock-back-source-docs 里的 vite.config.js、vercel.json、新 deploy workflow。
- UI 结果语言继续使用“顺利 / 受阻”，不要把“成功 / 失败”作为玩家看到的主要状态。
- 文本先转成逻辑链，再转成 data，不直接把全文塞进组件。
- Jackie 的介入不是惩罚，可以记录“Jackie knocked for you”，但不要做成扣分文案。

## 故事主链

| 节点 | 标题 | 功能 | 默认推进 |
| --- | --- | --- | --- |
| prologue | After Father's Day | Doctor 把 Rose 送回 Powell Estate，TARDIS 需要重校准 | 1-A |
| 1-A | 洗衣店门口 | Rose 发现 Jackie 和尖叫的洗衣机 | 1-B 或 1-C |
| 1-B | Jackie 的话 | 建立 Jackie 的恐惧、母女锚点、异常现场 | 1-C |
| 1-C | 第一次敲门 | 第一次核心选择：开门、拦住、测试、观察 | 1-D 或 branch_open_door |
| branch_open_door | 门被打开 | 早期开门后的困难分支，但不是 game over | 1-D |
| 1-D | TARDIS 来信 | TARDIS 给出第一条规则线索，引出“敲回去” | 2-A |
| 2-A | 墙裂开了 | 蓝门出现，Doctor 失踪位置被暗示 | 2-B |
| 2-B | Mickey 进场与规则 | Mickey 带来外部行动力，三条规则成形 | 2-C |
| 2-C | Jackie 和 Doctor | 规则进入亲密关系压力测试 | 2-D |
| 2-D | Doctor 开口 | Doctor 的声音/真实性成为判断题 | 3-A |
| 3-A | Jackie 的锚点 | 说服 Jackie 成为现实锚点 | 3-B |
| 3-B | 部署 | 分配 Mickey / Jackie / Rose 的位置 | 3-C |
| 3-C | 第三下前 | Pete 的声音与洗衣店变形，最终诱导 | 3-D |
| 3-D | 第三下落下 | 敲回去或开门的最终判定 | E-A |
| E-A | 洗衣店 | 异常退去，现实恢复但留下痕迹 | E-B |
| E-B | Jackie 和告别 | Rose 与 Jackie 的情感落点 | E-C |
| E-C | TARDIS 里 | Doctor/Rose 尾声，Father's Day 余波收束 | end |

## 三条规则

规则一：If it knocks first, do not open.  
含义：只要“它”先发出邀请，就不能把开门作为默认正确动作。

规则二：If you hear someone you love, check the room.  
含义：听见熟人的声音时，先确认现实里的那个人在哪里。

规则三：A real person can knock back. A copy can only ask.  
含义：真实的人可以主动回应；复制品只能请求被放进来。

## 全局状态草案

能力值：
- 感知：看见异常、听出节奏、辨认门/房间/雾气。
- 机智：推理规则、测试敲门、读懂 TARDIS 信息。
- 胆量：靠近危险、挡在别人前面、主动敲回去。
- 冷静：不立刻开门、不被熟人声音拖走、稳定 Jackie。

隐藏状态：
- 恐惧
- 时间静电
- 局势压力
- branchMode: normal / breached

重要 flags：
- jackie_not_alone
- spotted_empty_machine
- heard_rhythm
- liquid_flows_inward
- body_between
- jackie_told_you
- saw_breath_fog
- threat_is_localized
- holding_hands
- noted_knock_first
- tested_knock
- told_her_directly
- opened_door
- first_knock_back
- read_extra_line
- jackie_read_herself
- knows_doctor_went_in
- jackie_knocked
- doctor_heard_you
- heard_him_running
- confirmed_real_knock
- mickey_briefed
- mickey_knows_rule
- hit_the_door
- mickey_at_front

## 1-A 到 2-B 互动链

### 1-A 洗衣店门口

| 选择 | 检定 | 效果 | 下一步 |
| --- | --- | --- | --- |
| 冲过去站到妈妈身边 | 无 | jackie_not_alone，胆量临时 +1 | 1-B |
| 先停下来，扫一眼整个洗衣店 | 感知 DC10 | 顺利：发现空洗衣机却像有人在里面；spotted_empty_machine | 1-B |
| 直奔最里面那台机器 | 无 | 更快接触异常，Jackie 没有第一时间被保护 | 1-C |
| 站在门口，先听 | 感知 DC11 | heard_rhythm，听出敲击像有节奏 | 1-B |
| 检查地上的洗衣液 | 感知 DC12 | liquid_flows_inward，液体朝机器内部流 | 1-B |
| 大声叫她的名字 | 无 | jackie_saw_you_first | 1-B |

### 1-B Jackie 的话

| 选择 | 检定 | 效果 | 下一步 |
| --- | --- | --- | --- |
| 站到她和洗衣机之间 | 无 | body_between | 1-C |
| 问她发生了什么 | 无 | jackie_told_you，后续说服 Jackie DC -1 | 1-C |
| 走近，看滚筒里面 | 感知 DC12 | saw_breath_fog，机智临时 +1 | 1-C |
| 检查其他洗衣机是否异常 | 感知 DC10 | threat_is_localized，冷静临时 +1 | 1-C |
| 握住她的手 | 无 | holding_hands，Jackie 后续更快介入 | 1-C |
| 不动，等它再敲一次 | 冷静 DC10 | noted_knock_first | 1-C |

### 1-C 第一次敲门

| 选择 | 检定 | 效果 | 下一步 |
| --- | --- | --- | --- |
| 拦住她，不让她碰 | 胆量 DC8 | 顺利：挡住 Jackie；受阻：拖慢她但场面更混乱 | 1-D |
| 握住她的手腕，不动，看她眼睛 | 冷静 DC9 | jackie_pulled_back_gently，冷静临时 +1 | 1-D |
| 贴近门，仔细听 | 感知 DC13 | heard_uncanny_valley，听出声音像 Rose 但不对 | 1-D |
| 先自己敲三下玻璃，看它反应 | 机智 DC10 | tested_knock | 1-D |
| 什么都不做，看 Jackie 怎么反应 | 冷静 DC10 | 顺利：获得 Jackie 对异常的自然反应 | 1-D |
| 对她说：那不是我 | 无 | told_her_directly | 1-D |
| 拉开洗衣机门 | 无 | opened_door，branchMode = breached | branch_open_door |

### branch_open_door

开门不是失败结局，而是“受阻后的故事继续”。

建议效果：
- branchMode = breached
- 增加恐惧或时间静电
- Act 2/3 中复制品更容易使用 Rose / Doctor / Pete 的声音
- Jackie 仍然可以成为现实锚点

### 1-D TARDIS 来信

| 选择 | 检定 | 效果 | 下一步 |
| --- | --- | --- | --- |
| 敲洗衣机玻璃门，三下 | 无 | first_knock_back | 2-A |
| 仔细看手机屏幕，等更多 | 机智 DC9 | read_extra_line，机智临时 +1 | 2-A |
| 把手机给妈妈看 | 无 | jackie_read_herself | 2-A |
| 问 TARDIS：Doctor 在哪里 | 机智 DC11 | knows_doctor_went_in | 2-A |
| 让妈妈来敲 | 无 | jackie_knocked，jackie_knows | 2-A |
| 试着给 Doctor 发信息 | 机智 DC13 | doctor_heard_you | 2-A |

### 2-A 墙裂开了

| 选择 | 检定 | 效果 | 下一步 |
| --- | --- | --- | --- |
| 问 TARDIS：他在哪里 | 机智 DC9 | knows_doctor_went_in | 2-B |
| 贴近蓝门听声音 | 感知 DC11 | heard_him_running | 2-B |
| 敲蓝门三下 | 无 | confirmed_real_knock，胆量临时 +1 | 2-B |
| 把 TARDIS key 插进锁孔 | 胆量 DC12 | 顺利：门回应但不完全打开；受阻：门更冷、更重 | 2-B |
| 先把妈妈拉离那扇门 | 冷静 DC8 | jackie_is_back，冷静临时 +1 | 2-B |
| 检查蓝门门牌和门框 | 感知 DC9 | door_is_real，机智临时 +1 | 2-B |

### 2-B Mickey 进场与规则

| 选择 | 检定 | 效果 | 下一步 |
| --- | --- | --- | --- |
| 立刻告诉 Mickey 不要开任何门 | 无 | mickey_briefed | 2-C |
| 用规则二核对：Mickey 本人在这里 | 无 | mickey_knows_rule，机智临时 +1 | 2-C |
| 让 Mickey 去砸厕所门 | 无 | hit_the_door | 2-C |
| 让 Mickey 现在就去守前门 | 无 | mickey_at_front | 2-C |
| 让 Mickey 去照看 Jackie | 无 | mickey_with_jackie | 2-C |
| 让 Mickey 和你一起听蓝门 | 感知或机智 DC10 | mickey_verified_knock | 2-C |

## 数据结构草案

节点最小形状：
- id
- chapter
- title
- subtitle
- sceneType
- body
- messageCard
- choices

choice 最小形状：
- id
- label
- intent
- check: null 或 { ability, dc }
- outcomes: { smooth, blocked }
- effects
- next

effects 最小形状：
- addFlags
- addRecords
- abilityDelta
- tempAbilityDelta
- pressureDelta
- branchMode

## 移植顺序建议

第一步：只把 1-A 到 2-B 做成 data，验证结构能跑。  
第二步：接 2-C 到 3-D，处理 Jackie 锚点、Doctor 声音、Pete 声音、第三下。  
第三步：接 E-A 到 E-C，用 playerRecords 做结尾回声。  
第四步：再回头调整每张卡的 UI 节奏。

## 待确认问题

- 2-B 源文件后半是否还有正式选项。
- opened_door 是否首轮就开放。
- 恐惧 / 时间静电是否展示给玩家。
- 移动端每个节点最多展示几个选项。
- 结尾按记录组合生成，还是写固定结尾。
