# go-cqhttp-js

基于 go-cqhttp，使用 Typescript 实现的 QQ bot 框架，整体的实现方法，参照自 Mirai-js。

```js
bot.on('FriendMessage', new Middleware().friendFilter([ 12345 ])
    .done(data => {
        bot.sendMessage({
            user_id: data.user_id,
            message: new Message().addText('hello world!'),
        })
    })
);
```


## 开发文档

- Vercel -> [https://go-cqhttp-js.vercel.app](https://go-cqhttp-js.vercel.app)