// import debug from "debug"
import http from 'http'
import express, { NextFunction, Request, Response } from 'express'
import EventEmitter from "events"

export default class Server extends EventEmitter {
    public express: express.Application
    public server: http.Server

    constructor (options: { port: number }) {
        super()

        this.express = express()

        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))

        // 跨域处理
        /*
        this.express.all('*', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
            res.header('Access-Control-Max-Age', '2592000')
            res.header('X-Powered-By', ' Go-CQ-Bot 0.0.1')
            if (req.method.toUpperCase() === 'OPTIONS') return res.sendStatus(200)
            next()
        })
        */

        // 上报事件解析
        this.express.post('/', (req, res) => {
            this.emit('Event', req.body)
            return res.json('success')
        })

        // 404 及错误转发
        this.express.use((req, res, next) => {
            const error = new Error('接口调用失败')
            next(error)
        })
        // 错误处理
        this.express.use((err: Error, req: Request, res: Response) => {
            res.locals.message = err.message
            res.locals.error = req.app.get('env') === 'development' ? err : {}
            console.log(`接收到未知请求：${req}`, req.path )
            res.json({ error: err.message })
        })
        
        this.express.set('port', options.port)

        this.server = http.createServer(this.express)

        this.server.listen(options.port)

        /*
        this.server.on('error', (error: any) => {
            if (error.syscall !== 'listen') return error
            switch (error.code) {
                case 'EACCES':
                    console.log(`Port ${options.port} requeires elevalted privileges.`)
                    process.exit(1)
                    break
                case 'EADORINUSE':
                    console.log(`Port ${options.port} is already in use.`)
                    process.exit(1)
                    break
                default:
                    throw error
                    break
            }
        })
        */

        /*
        this.server.on('listening', () => {
            const addr = this.server.address()
            const bind = typeof(addr) === 'string' ? `Pipe ${addr}` : `Port ${options.port}`
            debug(`express sever `)(`Listening on ${bind}`)
        })
        */

        console.log('---------------------------------------------------------------------------------------------')
        console.log(` Server is running at http://localhost:${this.express.get('port')} in ${this.express.get('env')} node.`)
        console.log('---------------------------------------------------------------------------------------------')
    }
}
