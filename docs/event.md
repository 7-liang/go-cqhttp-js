# 事件

go-cqhttp-js 内置反向 http api 服务，用于接收来自 go-cqhttp 的事件通知，用户可通过 bot.on 方法监听不同的事件，并进行处理

go-cqhttp-js 封装了 go-cqhttp 大部分事件，并提供了相应的数据声明

## 私聊消息

事件名：PrivateMessage

数据类型：PrivateMessageData

```js
import { PrivateMessageData } from 'go-cqhttp-js'

bot.on('PrivateMessage', (data: PrivateMessageData) => {
    ...
})
```

## 群聊消息

事件名：GroupMessage

数据类型：GroupMessageData

```js
import { GroupMessageData } from 'go-cqhttp-js'

bot.on('GroupMessage', (data: GroupMessageData) => {
    ...
})
```

