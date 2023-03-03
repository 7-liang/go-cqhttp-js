# 准备工作

go-cqhttp-js 依赖 go-cqhttp，在使用前需确认 go-cqhttp 能正常运行。

## 安装 go-cqhttp-js

```
npm i go-cqhttp-js
```

## 配置 go-cqhttp

go-cqhttp-js 使用 express 编写了内置的 http api 服务端，使用前需开启 go-cqhttp 的反向 http 通信功能

参考下方示例修改 go-cqhttp 的 config.yml 设置文件

```yml
heartbeat:                              # 心跳包设置
  interval: -1                          # go-cqhttp-js 使用反向 http，可不开启 心跳包功能

servers:
  - http:                               # http 通信设置
      address: 127.0.0.1:5700               # HTTP监听地址
      timeout: 5                          # 反向 http 超时时间
      long-polling:                       
        enabled: false
        max-queue-size: 2000
      middlewares:                        
        <<: *default
      post:                               # 反向 http 设置
      - url: 'http://127.0.0.1:5701'      # 反向 http 服务器地址
        secret: ''                        # 验证密钥，无
```

go-cqhttp 与 go-cqhttp-js 可不在同一台服务器运行


## 启动

1. 按照 go-cqhttp 官方文档启动 go-cqhttp
2. 启动自己的程序，go-cqhttp-js 会启动 反向 http api 服务端与 go-cqhttp 进行通信


## 通信机制

1. go-cqhttp-js 启动反向 http api 服务端，接收来自 go-cqhttp 的 post 信息
2. go-cqhttp-js 分析接收到的 post，转发成不同的事件
3. 用户通过 bot.on 方法来监听需要的事件，编写自己的程序
