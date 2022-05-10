# 事件 Event

go-cqhttp-js 内置反向 http api 服务，用于接收来自 go-cqhttp 的事件通知，用户可通过 bot.on 方法监听不同的事件，并进行处理

go-cqhttp-js 封装了 go-cqhttp 大部分事件，并提供了相应的数据声明


## 私聊消息

### PrivateMessage

`私聊消息`

#### 事件数据

`PrivateMessageData`

```js
{
    time: number            // 事件发生的时间戳
    self_id: number         // 接收到事件的 bot QQ 号
    post_type: string       // 上报类型，message
    message_type: string    // 消息类型，private
    sub_type: string        // 消息子类型，friend 好友消息，group 群临时会话，group_self 群中自身发送的，other
    temp_source: number     // 临时会话来源，0 群聊，1 QQ咨询, 2 查找, 3 QQ电影, 4 热聊, 6 验证消息，7 多人聊天，8 约会， 9 通讯录
    message_id: number      // 消息 ID
    user_id: number         // 发送人 QQ
    message: string         // 消息内容
    raw_message: string     // 原始消息内容
    font: number            // 字体
    sender: {               // 发送人信息
        user_id: number     // 发送人 QQ
        nickname: string    // 昵称
        sex: string         // 性别，male, female, unknown
        age: number         // 年龄
    }
}
```

#### 示例

```js
import { PrivateMessageData } from 'go-cqhttp-js'

bot.on('PrivateMessage', (data: PrivateMessageData) => {
    ...
})
```

## 群消息

### GroupMessage

`群消息`

#### 事件数据

`GroupMessageData`

```js
{
    time: number            // 事件发生的时间戳
    self_id: number         // 收到事件的 bot QQ
    post_type: string       // 上报类型，message
    message_type: string    // 消息类型，group
    sub_type: string        // 消息子类型，normal 正常消息，anonymous 匿名消息，notice 系统提示
    message_id: number      // 消息 ID
    group_id: number        // 群号
    user_id: number         // 发送人 QQ
    anonymous: null | {     // 匿名消息，如不是匿名消息则为 null
        id: number          // 匿名用户 ID
        name: string        // 匿名用户名称
        flag: string        // 匿名用户 flag，在调用禁言 api 时需要
    }
    message: string         // 消息内容
    raw_message: string     // 原始消息内容
    font: number            // 字体
    sender: {               // 发送人信息
        user_id: number     // 发送人 QQ
        nickname: string    // 昵称
        card: string        // 群名片 / 备注
        sex: string         // 性别，male, female, unknown
        age: number         // 年龄
        area: string        // 地区
        level: string       // 成员等级
        role: string        // 角色，owner, admin, member
        title: string       // 专属头衔
    }
}
```

#### 示例

```js
import { GroupMessageData } from 'go-cqhttp-js'

bot.on('GroupMessage', (data: GroupMessageData) => {
    ...
})
```

## 群文件

### GroupUploadNotice

`群文件上传`

#### 事件数据

`GroupUploadNoticeData`

```js
{
    time: number            // 事件发生的时间戳
    self_id: number         // 收到事件的 bot QQ
    post_type: string       // 上报类型, notice
    notice_type: string     // 通知类型，group_upload
    group_id: number        // 群号
    user_id: number         // 发送人 QQ
    file: {                 // 文件信息
        id: string          // 文件 ID
        name: string        // 文件名
        size: number        // 文件大小，字节
        busid: number       // 未知
    }
}
```

#### 示例

```js
import { GroupUploadNoticeData } from 'go-cqhttp-js'

bot.on('GroupUploadNotice', (data: GroupUploadNoticeData) => {
    ...
})
```

## 管理员变动


### GroupAdminNotice

`群管理员变动`

#### 事件数据

`GroupAdminNoticeData`

```js
{
    time: number            // 事件发生的时间戳
    self_id: number         // 收到事件的 bot QQ
    post_type: string       // 上报类型 notice
    notice_type: string     // 通知类型 group_admin
    sub_type: string        // 事件子类型，set 设置管理员，unset 取消管理员
    group_id: number        // 群号
    user_id: number         // 管理员 QQ
}
```

## 群成员变动

### GroupRequest

`加群请求 / 邀请`

#### 事件数据

`GroupRequestData`

```js
{
    time: number            // 事件发生时间戳
    self_id: number         // bot QQ
    post_type: string       // 上报类型 request
    request_type: string    // 请求类型 group
    sub_type: string        // 请求子类型，add 加群请求，invite 邀请登录号入群
    group_id: number        // 群号
    user_id: number         // 发送请求的 QQ
    comment: string         // 验证信息
    flag: string            // 请求 flag, bot.setGroupRequest 需要
}
```

***

### GroupDecreaseNotice

`群成员减少`

#### 事件数据

`GroupDecreaseNoticeData`

```js
{
    time: number            // 事件发生的时间戳
    self_id: number         // 收到事件的 bot QQ
    post_type: string       // 上报类型 notice
    notice_type: string     // 通知类型 group_decrease
    sub_type: string        // 事伯子类型，leave 主动退群，kick 成员被踢, kick_me 登录号被踢
    group_id: number        // 群号
    operator_id: number     // 操作人 QQ，如是主动退群，则同 user_id 一致
    user_id: number         // 离开者 QQ
}
```

***

### GroupIncreaseNotice

`群成员增加`

#### 事件数据

`GroupIncreaseNoticeData`

```js
{
    time: number            // 事件发生的时间戳
    self_id: number         // 收到事件的 bot QQ
    post_type: string       // 上报类型 notice
    notice_type: string     // 通知类型 group_increase
    sub_type: string        // 事件子类型，approve 管理员同意入群，invite 管理员邀请入群
    group_id: number        // 群号
    operator_id: number     // 操作人 QQ
    user_id: number         // 加入者 QQ
}
```

## 禁言

### GroupBanNotice

`群禁言`

#### 事件数据

`GroupBanNoticeData`

```js
{
    time: number            // 事件发生时间戳
    self_id: number         // 收到事件的 bot QQ
    post_type: string       // 上报类型 notice
    notice_type: string     // 通知类型 group_ban
    sub_type: string        // 事件子类型，ban 禁言, lift_ban 解除禁言
    group_id: number        // 群号
    operator_id: number     // 操作人 QQ
    user_id: number         // 被禁言 QQ
    duration: number        // 禁言时长，单位 秒
}
```

## 好友变动

### FriendRequest

`加好友请求`

#### 事件数据

`FriendRequestData`

```js
{
    time: number            // 事件发生时间戳
    self_id: number         // bot QQ
    post_type: string       // 上报类型 request
    request_type: string    // 请求类型 friend
    user_id: number         // 请求人 QQ
    comment: string         // 验证信息
    flag: string            // 请求 flag, 调用处理 bot.setFriendRequest 需要
}
```

***

### FriendAddNotice

`好友添加`

#### 事件数据

`FriendAddNoticeData`

```js
{
    time: number            // 事件发生时间戳
    self_id: number         // 收到事件的 bot
    post_type: string       // 上报类型 notice
    notice_type: string     // 通知类型 friend_add
    user_id: number         // 新添加的好友 QQ
}
```

## 消息撤回

### GroupRecallNotice

`群消息撤回`

#### 事件数据

`GroupRecallNoticeData`

```js
{
    time: number            // 事件发生时间戳
    self_id: number         // 收到事件的 bot
    post_type: string       // 上报类型 notice
    notice_type: string     // 通知类型 group_recall
    group_id: number        // 群号
    user_id: number         // 发送人 QQ
    operator_id: number     // 操作人 QQ
    message_id: number      // 被撤回的消息 ID
}
```

***

### FriendRecallNotice

`好友消息撤回`

#### 事件数据

`FriendRecallNoticeData`

```js
{
    time: number            // 事件发生时间戳
    self_id: number         // 收到事件的 bot
    post_type: string       // 上报类型 notice
    notice_type: string     // 通知类型 friend_recall
    user_id: number         // 好友 QQ
    message_id: number      // 被撤回的消息 ID
}
```

## 戳一戳

### FriendPokeNotice

`好友戳一戳`

#### 事件数据

`FriendPokeNoticeData`

```js
{
    post_type: string       // 上报类型 notice
    notice_type: string     // 消息类型 notify
    sub_type: string        // 提示类型 poke
    self_id: number         // bot
    sender_id: number       // 发送人 QQ
    user_id: number         // 发送人 QQ
    target_id: number       // 被戳人 QQ
    time: number            // 时间
}
```

***

### GroupPokeNotice

`群内戳一戳`

#### 事件数据

`GroupPokeNoticeData`

```js
{
    post_type: string       // 上报类型 notice
    notice_type: string     // 消息类型 notify
    sub_type: string        // 提示类型 poke
    group_id: number        // 群号
    user_id: number         // 发送人 QQ
    target_id: number       // 被戳人 QQ
}
```

## 红包王

### LuckyKingNotice

`群红包运气王提示`

#### 事件数据

`LuckyKingNoticeData`

```js
{
    post_type: string       // 上报类型 notice
    notice_type: string     // 消息类型 notify
    group_id: number        // 群号
    sub_type: string        // 提示类型 lucky_king
    user_id: number         // 红包发送者 QQ
    target_id: number       // 运气王 QQ
}
```

## 群荣誉

### GroupHonorNotice

`群成员荣誉变更提示`

#### 事件数据

`GroupHonorNoticeData`

```js
{
    post_type: string       // 上报类型 notice
    notice_type: string     // 消息类型 notify
    group_id: number        // 群号
    sub_type: string        // 提示类型 honor
    user_id: number         // 成员 QQ
    honor_type: string      // 荣誉类型，talkative 龙王, performer 群聊之火，emotion 快乐源泉
}
```

## 成员名片更新

### GroupCardNotice

`群成员名片更新`

#### 事件数据

`GroupCardNoticeData`

```js
{
    post_type: string       // 上报类型 notice
    notice_type: string     // 消息类型 group_card
    group_id: number        // 群号
    user_id: number         // 成员QQ
    card_new: string        // 新名片
    card_old: string        // 旧名片
}
```

## 离线文件

### OfflineFileNotice

`接收到离线文件`

#### 事件数据

`OfflineFileNoticeData`

```js
{
    post_type: string       // 上报类型 notice
    notice_type: string     // 消息类型 offline_file
    user_id: number         // 发送人 QQ
    file: {                 // 文件数据
        name: string        // 文件名
        size: number        // 文件大小
        url: string         // 下载链接
    }
}
```

## 客户端

### ClientStatusNotice

`其他客户端在线状态变更`

#### 事件数据

`ClientStatusNoticeData`

```js
{
    post_type: string       // 上报类型 notice
    notice_type: string     // 消息类型 client_status
    client: {               // 客户端信息
        app_id: number      // 客户端 ID
        device_name: string // 设备名称
        device_kind: string // 设备类型
    }
    online: boolean         // 当前是否在线
}
```

## 精华消息

### EssenceNotice

`精华消息`

#### 事件数据

`EssenceNoticeData`

```js
{
    post_type: string       // 上报类型 notice
    notice_type: string     // 消息类型 essence
    sub_type: string        // add 添加，delete 移除
    sender_id: number       // 消息发送人 QQ
    operator_id: number     // 操作人 QQ
    message_id: number      // 消息 ID
}
```
