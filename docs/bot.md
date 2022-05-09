# 机器人 Bot

## 实例化

类 Bot 封装了大部分 go-cqhttp api ，实例化时，需要传入相应的参数

#### 参数
- `base_url: string` 必选

    go-cqhttp 的连接地址及端口

- `reverse_port: number` 必选

    go-cqhttp-js 的反向 http 服务端口

- `qq: number` 必选

    机器人 QQ 号

#### 返回值

无


#### 示例

```js
import { Bot } from 'go-cqhttp-js'

const bot = new Bot({
    base_url: 'http://127.0.0.1:5700',
    reverse_port: 5701,
    qq: 12345,
})
```


## 成员方法

### on

`on` 方法在实例上注册一个监听指定事件的事件处理器

#### 参数

- `eventType: string | string[]` 必选

    需要监听的事件类型，可传入数组，监听多个事件

    可监听的事件类型，参见 [事件 Event](event)

- `callback: function` 必选

    处理该事件的回调函数，可使用中间件 `Middleware` 实例的 `done` 方法返回。

#### 返回值

`handle: number | number[]`，该事件处理器的唯一标识，用于移除该处理器。

?> 每个 `eventType` 事件处理器都有一个唯一的命名空间 `handle`，在移除事件处理器时，需要给出相对应的 `handle`

#### 示例

```js
// 监听好友消息事件
bot.on('PrivateMessage', (data: PrivateMessageData) => {
    ...
})
```

```js
// 监听群消息事件，使用 Middleware 中间件
bot.on('GroupMessage', new Middleware()
    .groupFilter([ 12345 ], true)
    .done(data => {
        ...
    })
)
```

***

### one

`one` 方法将在实例上注册一个`只监听一次`的事件处理器，该处理器只被调用一次。

#### 参数

- `eventType: string | string[]` 必选

    同 `on` 方法

- `callback: function` 必选

    同 `on` 方法

#### 示例

```js
// 监听好友消息事件
bot.one('PrivateMessage', data => {
    ...
})
```

***

### off

`off` 方法用于移除一个事件处理器。

#### 参数

- `eventType: string` 必选

    欲移除的事件处理器的事件类型。

- `handle: number | number[]` 可选

    欲移除的事件处理器的唯一标识；
    
    当不提供该参数时，则移除所指定的 `eventType` 下的所有事件处理器。

#### 示例

```js
const handle = bot.on('PrivateMessage', data => {
    ...
})

bot.off('PrivateMessage', handle)
```

***

### offAll

`offAll` 方法用于移除所有的事件处理器。

#### 参数

- `eventType: string | string[]` 可选

    给出此参数，则移除指定事件下的所有事件处理器，反之，则移除所有事件处理器。

#### 示例

```js
bot.offAll()
```
```js
bot.offAll(['PrivateMessage', 'GroupMessage'])
```

***

### sendMessage

`sendMessage` 方法向好友或群发送一条消息。

#### 参数

- `opts: object`

```js
{
    // 可选，好友 QQ 号，如有 group_id 和 temp 参数，则代表发送临时会话消息
    user_id?: number
    // 可选，群号，如没有 temp 参数，则代表发送群消息
    group_id?: number
    // 可选，临时会话标识，如需发送临时会话，则 temp, group_id, user_id 三个参数都需要
    temp?: boolean
    // 必选，需要发送的消息内容，通过 Message 实例提供
    message: Message
}
```
!> 临时会话消息有被 `风控` 的风险，请谨慎使用

#### 返回值 

`Promise<SendMsgResult>`

```js
{
    message_id: number      // 所发送的消息标识 ID
}
```

#### 示例

```js
bot.on(`PrivateMessage`, data => {
    const { user_id, message_id } = data
    bot.sendMessage({
        user_id,
        message: new Message().addReply({ id: message_id }).addText('hi')
    })
})
```

***

### recallMessage

`recallMessage` 方法撤回一条消息

#### 参数

- `opts: object`

```js
{
    message_id: number      // 必选，要撤回的消息 ID
}
```

?> 撤回群组消息需要 BOT 有管理员权限 

#### 示例

```js
bot.on('GroupMessage', data => {
    const { message_id } = data

    bot.recallMessage({ message_id })
})
```

***

### getMessage

`getMessage` 获取指定的消息数据

#### 参数

- `opts: object`

```js
{
    message_id: number      // 要获取的消息 ID
}
```

#### 返回值

`Promise<GetMsgResult>`

```js
{
    message_id: number      // 消息ID
    real_id: number         // 消息真实ID
    sender: {               // 发送人数据
        user_id: number     // QQ 号
        nickname: string    // 昵称
    } 
    time: number            // 发送时间
    message: string         // 消息内容
    raw_message: string     // 消息原始内容
}
```

#### 示例

```js
bot.on(`PrivateMessage`, data => {
    const { message_id } = data

    bot.getMessage({ message_id })
        .then(data => console.log(data))
})
```

***

### memberKick

`memberKick`，群组踢人

#### 参数

- `opts: object`

```js
{
    group_id: number                // 群号
    user_id: number                 // 要踢的 QQ 号
    reject_add_request?: boolean     // 可选，默认值 false，是否拒绝此人的加群请求
}
```

#### 示例

```js
bot.memberKick({ group_id: 12345, user_id: 54321 })
```

***

### groupBan

`群组单人禁言`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 要操作的群号
    user_id: number         // 要禁言的 QQ
    duration?: number       // 可选，禁言时长，默认 1000 秒
}
```

#### 示例

```js
bot.groupBan({ group_id: 12345, user_id: 54321, duration: 3000 })
```

***

### groupBanAll

`群组全员禁言`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 要操作的群号
    enable?: boolean        // 可选，默认 true 开启禁言，false 关闭禁言
}
```

#### 示例

```js
// 开启全员禁言
bot.groupBanAll({ group_id: 12345 })

// 关闭全员禁言
bot.groupBanAll({ group_id: 12345, enable: false })
```

***

### setGroupAdmin

`设置群管理员`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 要操作的群号
    user_id: number         // 要设置为管理员的 QQ
    enable?: boolean        // 可选，默认 true 设置管理员，false 取消管理员
}
```

#### 示例

```js
// 设置管理员
bot.setGroupAdmin({ group_id: 12345, user_id: 54321 })

// 取消管理权限
bot.setGroupAdmin({ group_id: 12345, user_id: 54321, enable: false })
```

***

### setMemberCard

`设置群用户名片`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 要操作的群号
    user_id: number         // 要操作的群用户 QQ
    card?: string           // 可选，名片内容，默认为 空，清空群名片
}
```

#### 示例

```js
bot.setMemberCard({ group_id: 12345, user_id: 54321, card: '群管家' })
```

***

### setGroupName

`设置群名称`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 要操作的群号
    group_name: string      // 群名称
}
```

#### 示例

```js
bot.setGroupName({ group_id: 12345, group_name: 'go-cqhttp-js 技术交流群' })
```

***

### groupLeave

`退出群组`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 要退出的群号
    is_dismiss?: boolean    // 可选，是否解散该群，默认 false
}
```

#### 示例

```js
bot.groupLeave({ group_id: 12345, is_dismiss: true })
```

***

### setMemberTitle

`设置用户群组专用头衔` 

#### 参数

- `opts: object`

```js
{
    group_id: number        // 要操作的群号
    user_id: number         // 要操作的群用户 QQ
    special_title?: string  // 可选，要设置的头衔，默认为空，表示清空该用户头衔
    duration?: number       // 可选，过期时间，默认 -1,永不过期，单位 秒
}
```

#### 示例

```js
bot.setMemberTitle({ group_id: 12345, user_id: 54321, special_title: '希望之星' })
```

***

### setFriendRequest

`处理添加好友请求`

#### 参数

- `opts: object`

```js
{
    flag: string            // 好友请求数据的 flag
    approve?: boolean       // 可选，默认 true 同意，false 拒绝
    remark?: string         // 可选，通过后的好友备注 
}
```

#### 示例

```js
bot.on('FriendRequest', data => {
    const { flag } = data

    bot.setFriendRequest({ flag, remark: '小七' })
})
```

***

### setMemberJoinRequest

`处理加群请求 / 邀请`

#### 参数

- `opts: object`

```js
{
    flag: string            // 加群请求数据中的 flag
    sub_type: string        // 请求类型，需要和加群请求上报的数据中的 sub_type 一致
    approve?: boolean       // 可选，默认 true 同意
    reason?: string         // 可选，拒绝理由
}
```

#### 示例

```js
bot.on('GroupRequest', data => {
    const { flag, sub_type } = data

    bot.setMemberJoinRequest({ flag, sub_type })
})
```

***

### getStrangerInfo

`获取陌生人信息`

#### 参数

- `opts: object`

```js
{
    user_id: number         // 要获取的 QQ
    no_cache?: boolean      // 可选，默认 false 不使用缓存
}
```

#### 返回值

`Promise<GetStrangerInfoResult>`

```js
{
    user_id: number         // QQ
    nickname: string        // 昵称
    sex: string             // 性别，male 或 female 或 unknown
    age: number             // 年龄
    qid: string             // qid ID 身份卡
    level: number           // 等级
    login_days: number      // 等级
}
```

#### 示例

```js
bot.getStrangerInfo({ user_id: 54321 })
    .then(data => console.log(data))
```

***

### getFriendList

`获取好友列表`

#### 参数

无

#### 返回值

`Promise<GetFriendListResult[]>`

```js
[
    {
        user_id: number     // QQ
        nickname: string    // 昵称
        remark: string      // 备注
    }
]
```

#### 示例

```js
bot.getFriendList()
    .then(data => {
        data.forEach(item => console.log(item))
    })
```

***

### deleteFriend

`删除好友`

#### 参数

- `opts: object`

```js
{
    friend_id: number       // 要删除的好友 QQ
}
```

#### 示例

```js
bot.deleteFriend({ friend_id: 54321 })
```

***

### getGroupInfo

`获取群信息`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 群号
    no_cache?: boolean      // 可选，默认 false 不使用缓存
}
```

#### 返回值

`Promise<GetGroupInfoResult>`

```js
{
    group_id: number            // 群号
    group_name: string          // 群名称
    group_memo: string          // 群备注
    group_create_time: number   // 群创建时间
    group_level: number         // 群等级
    member_count: number        // 当前成员数
    max_member_count: number    // 最大成员数
}
```

#### 示例

```js
bot.getGroupInfo({ group_id: 12345 })
    .then(data => console.log(data))
```

***

### getGroupList

`获取群列表`

#### 参数

无

#### 返回值

`Promise<GetGroupInfoResult[]>`

#### 示例

```js
bot.getGroupList()
    .then(data => {
        data.forEach(item => console.log(item))
    })
```

***

### getMemberInfo

`获取群成员信息`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 群号
    user_id: number         // 要查询的群成员 QQ
    no_cache?: boolean      // 可选，默认 false 不使用缓存
}
```

#### 返回值

`Promise<GetGroupMemberInfoResult>`

```js
{
    group_id: number            // 群号
    user_id: number             // QQ
    nickname: string            // 昵称
    card: string                // 群名片 / 备注
    age: number                 // 年龄
    sex: string                 // 性别，male, female, unknown
    area: string                // 地区
    join_time: number           // 加群时间戳
    last_sent_time: number      // 最后发言时间戳
    level: string               // 成员等级
    role: string                // 角色，owner, admin, member
    unfriendly: boolean         // 是否不良记录成员
    title: string               // 专属头衔
    title_expire_time: number   // 专属头衔过期时间戳
    card_changeable: boolean    // 是否允许修改群名片
    shut_up_timestamp: number   // 禁言到期时间
}
```

#### 示例

```js
bot.getMemberInfo({ group_id: 12345, user_id: 54321 })
    .then(data => console.log(data))
```

***

### getMemberList

`获取群成员列表信息`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 群号
}
```

#### 返回值

`Promise<GetGroupMemberInfoResult[]>`

#### 示例

```js
bot.getMemberList({ group_id: 12345 })
    .then(data => {
        data.forEach(item => console.log(item))
    })
```

***

### getHonorInfo

`获取群荣誉信息`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 群号
    type:                   // 要获取的荣誉类型
        'talkative' |       // 龙王
        'performer' |       // 群聊之火
        'legend' |          // 群聊炽焰
        'strong_newbie' |   // 冒尖小春笋
        'emotion' |         // 快乐之源
        'all'               // 全部类型
}
```

#### 返回值

`Promise<GetGroupHonorInfoResult>`

```js
// GetGroupHonorInfoResult_item
{
    user_id: number         // QQ
    nickname: string        // 昵称
    avatar: string          // 头像 url
    description: string     // 荣誉描述
}

{
    group_id: number                // 群号
    current_talkative: {            // 当前龙王，仅
        user_id: number             // QQ
        nickname: string            // 昵称
        avator: string              // 头像 url
        day_count: number           // 持续天数
    }
    talkative_list: GetGroupHonorInfoResult_Item[]      // 历史龙王
    performer_list: GetGroupHonorInfoResult_Item[]      // 群聊之火
    legend_list: GetGroupHonorInfoResult_Item[]         // 群聊炽焰
    strong_newbie_list: GetGroupHonorInfoResult_Item[]  // 冒尖小春笋
    emotion_list: GetGroupHonorInfoResult_Item[]        // 快乐之源
}
```

#### 示例

```js
bot.getHonorInfo({ group_id: 12345, type: 'all' })
    .then(data => console.log(data))
```

***

### canSendImage

`检查是否可以发送图片`

#### 参数

无

#### 返回值

`Promise<CanSEndImageResult>`

```js
{
    yes: boolean            // 是或否
}
```

#### 示例

```js
bot.canSendImage()
    .then(data => console.log('yes: ', data.yes))
```

***

### getVersion

`获取版本信息`

#### 参数

无

#### 返回值

`Promise<GetVersionInfoResult>`

```js
{
    app_name: string                    // 应用标识，go-cqhttp 固定值
    app_version: string                 // 应用版本
    app_full_name: string               // 应用完整名称
    protocol_version: string            // OneBot 标准版本，固定值 v11
    coolq_edition: string               // 原 Coolq 版本，固定值 pro
    coolq_directory: string
    "go-cqhttp": boolean                // 是否为 go-cqhttp，固定值 true
    plugin_version: string              // 固定值 4.15.0
    plugin_build_number: number         // 固定值 99
    plugin_build_configuration: string  // 固定值 release
    runtime_version: string
    runtime_os: string
    version: string                     // 应用版本
    protocol: number                    // 当前登陆使用协议类型 0/1/2/3/-1
}
```

#### 示例

```js
bot.getVersion()
    .then(data => console.log(data))
```

***

### setRestart

`重启 go-cqhttp`

!> 貌似无效

#### 参数

- `opts: object`

```js
{
    delay?: number      // 可选，要延迟的毫秒数，默认 0，如默认情况下无法重启，可尝试设置为 2000 左右
}
```

#### 示例

```js
bot.setRestart({ delay: 2000 })
```

***

### getVipInfo

`获取 vip 信息`

#### 参数

- `opts: object`

```js
{
    user_id: number     // 要查询的 QQ
}
```

#### 返回值

`Promise<GetVipInfoResult>`

```js
{
    user_id: number             // QQ
    nickname: string            // 昵称 
    level: number               // QQ 等级
    level_speed: number         // 等级加速度
    vip_level: string           // 会员等级
    vip_growth_speed: number    // 会员成长速度
    vip_growth_total: number    // 会员成长总值
}
```

#### 示例

```js
bot.getVipInfo({ user_id: 54321 })
    .then(data => console.log(data))
```

***

### sendGroupNotice

`发送群公告`

#### 参数

- `opts: object`

```js
{
    group_id: number        // 群号
    content: string         // 公告内容
    image?: string          // 可选，图片路径
}
```

#### 示例

```js
bot.sendGroupNotice({ group_id: 12345, content: '测试公告内容' })
```
