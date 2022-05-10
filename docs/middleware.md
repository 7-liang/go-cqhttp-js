# 中间件 Middleware

## 介绍

`Middleware` 参照 `Mirai-js` 实现，允许开发者利用处理逻辑、模块化处理 go-cqhttp 的事件消息。

该模块实现了 `express-like` 的中间件机制，一个中间件调用 `next()` 后，将转入下游中间件执行，当执行到 `done()` 方法后结束。


## 使用

```js
import { Middleware } from 'go-cqhttp-js'

bot.on('GroupMessage', new Middleware()
    .groupFilter([ 12345 ])
    .textProcessor()
    .done(data => {
        ...
    })
)
```

`Middleware` 实例的 `done` 方法用于返回一个带有中间件的事件处理器入口。

## 解构消息链

`go-cqhttp` 是通过使用 `CQ Code` 字符串文本来接收和发送消息。

`Middleware` 在实例化时，如应用于 `PrivateMessage` 和 `GroupMessage` 时，会自动将接收到的 `CQ Code` 消息文本解构成 `message_chain` 消息链，置于 `data.message_chain` 中，方便中间件调用。

例：

```js
[
    Text ( type: 'text', data: { text: '消息内容' } ),       // 文本消息
    Face ( type: 'face', data: { id: 123 } ),               // 表情消息
    ...
]
```

## 预定义中间件

### messageProcessor

`归类指定类型的消息`，作用于 `PrivateMessage` 和 `GroupMessage`

该中间件不同类型的消息分类，放在一个 Map 中，置于 `data.classified` 中

#### 参数

- `types: string[]` 必选

    由消息类型组成的数组，指定要分类哪些消息，如 `['text', 'image', 'at']`

#### 示例

```js
bot.on('GroupMessage', new Middleware()
    .messageProcessor(['text', 'image', 'face'])
    .done(data => {
        const { text, image, face } = data.classified
        text.forEach(item => console.log(item.data.text))
    })
)
```

***

### textProcessor

该中间件将所有文本类型消息拼接在一起，置于 `data.text` 中。

#### 参数

无

#### 示例

```js
bot.on('PrivateMessage', new Middleware()
    .textProcessor()
    .done(data => {
        console.log(data.text)
    })
)
```

***

### groupFilter

该中间件将允许指定的群消息通过，相当于群白名单功能。

#### 参数

- `groups: number[]` 必选

    一个数组，允许通过的群号。

- `allow: boolean` 必选

    true 允许通过，false 不允许通过

#### 示例

```js
bot.on('GroupMessage', new Middleware()
    .groupFilter([ 12345, 67890], true)
    .done(data => {
        ...
    })
)
```

***

### friendFilter

该中间件将允许指定的好友消息通过，如和 `groupFilter` 一起使用，则过滤群成员消息

#### 参数

- `friends: number[]` 必选

    一个数组，允许通过的好友 QQ

- `allow: boolean` 必选

    true 允许通过，false 不允许通过

#### 示例

```js
bot.on('GroupMessage', new Middleware()
    .groupFilter([ 12345 ], true)
    .friendFilter([ 54321 ], true)  // 只允许群 12345 成员 54321 通过
    .done(data => {
        ...
    })
)
```

***

### atFilter

过滤 @ 指定群成员的消息

#### 参数

- `ats: number[]` 必选

    需要过滤的被 @ 人的 QQ

- `allow: boolean` 必选

    是否通过

#### 示例

```js
bot.on('GroupMessage', new Middleware()
    .groupFilter([ 12345 ], true)
    .atFilter([ 54321 ], true)
    .done(data => {
        ...
    })
)
```

***

### friendRequestProcessor

用于加好友请求 `FriendRequest` 事件。

应用该中间件，将在 `data` 中放置两个方法，`data.agree()` 同意，`data.refuse()` 拒绝

#### 参数

无

#### 示例

```js
bot.on('FriendRequest', new Middleware()
    .friendRequestProcessor()
    .done(data => {
        if (data.comment == '验证信息') data.agree()    // 在 FriendRequest 事件中判断请求验证信息，决定是否同意
        else data.refuse()
    })
)
```

***

### memberJoinRequestProcessor

用于加群请求 `GroupRequest` 事件。

应用该中间件，将在 `data` 中放置两个方法，`data.agree()` 同意加群，`data.refuse()` 拒绝加群

#### 参数

无

#### 示例

```js
bot.on('GroupRequest', new Middleware()
    .groupFilter([ 12345 ], true)
    .memberJoinRequestProcessor()
    .done(data => {
        if (data.comment == '验证信息') data.agree()    // 在 FriendRequest 事件中判断请求验证信息，决定是否同意
        else data.refuse()
    })
)
```

## 自定义中间件

### use

使用 `use` 方法，将插入一个自定中间件。

#### 参数

- `callback: function` 必选

    `(data: object, next: function) => void`

    处理完成后，根据处理逻辑决定是否调用 `next()`，以将控制权交到下一个中间件。

#### 示例

```js
bot.on('FriendMessage', new Middleware()
    .use((data, next) => {
        ...
        next()      // 调用 next ，则流转至下一中间件
    })
    .done(data => {
        ...
    })
)
```