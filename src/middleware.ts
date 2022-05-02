import { faceMap } from "./utils/misc"
import Message from "./message"
import setFriendAddRequest from "./core/set-friend-add-request"
import setGroupAddRequest from "./core/set-group-add-request"


export default class Middleware {
    private queue: ((data: any, next: any) => any) []

    constructor () {
        this.queue = []

        // 将 message 解构为 消息链结构，置于 data.message_chain
        this.queue.push((data, next) => {
            data.message_chain = new Message().parse(data.message)
            next()
        })
    }

    /**
     * 归类指定类型的消息，置于 data.classified
     * @param {string[]} types 需要归类的消息类型，如 text, image, face 等
     */
    messageProcessor (types: string[]) {
        this.queue.push((data, next) => {
            data.classified = {}
            types.forEach(type => {
                data.classified[type] = data.message_chain.filter((message: any) => message.type == type)
            })
            next()
        })
        return this
    }

    /**
     * 提取文本类 text 消息，拼接在一起，置于 data.text
     */
    textProcessor () {
        this.queue.push((data, next) => {
            data.text = data.message_chain
                .filter((msg: any) => msg.type == 'text')
                .map((msg: any) => msg.data.text).join('')
            next()
        })
        return this
    }

    /**
     * 过滤指定的群消息，决定是否通过
     * @param {number[]} groups 需要设置是否通过的群号
     * @param {boolean} allow 默认 true 通过，flase 禁止通过
     */
    groupFilter (groups: number[], allow = true) {
        const groups_set = new Set(groups)
        this.queue.push((data, next) => {
            if (data.hasOwnProperty('group_id')) {
                if (groups_set.has(data.group_id)) allow && next()
            } else {
                !allow && next()
            }
        })
        return this
    }

    /**
     * 过滤指定的用户消息，决定是否通过，如和 groupFilter 一起使用，则过滤群成员消息
     * @param {number[]} friends 需要过滤的 QQ 号
     * @param {boolean} allow 默认 true 通过，false 禁止通过
     */
    friendFilter (friends: number[], allow = true) {
        const friends_set = new Set(friends)
        this.queue.push((data, next) => {
            if (data.hasOwnProperty('user_id')) {
                if (friends_set.has(data.user_id)) allow && next()
            } else !allow && next()
        })
        return this
    }

    /**
     * 过滤 @ 消息，决定是否通过
     * @param {number[]} ats 需要通过的被 @ 人 QQ 号 
     * @param {boolean} allow 默认 true 通过，false 禁止通过
     */
    atFilter (ats: number[], allow = true) {
        const ats_set = new Set(ats)
        this.queue.push((data, next) => {
            if (data.hasOwnProperty('group_id')) {
                for (const msg of data.message_chain) {
                    if (msg.type == 'at' && (ats_set.has(parseInt(msg.data.qq)) || msg.data.qq == 'all'))
                        return allow && next()
                }
                !allow && next()
            } else !allow && next()
        })
        return this
    }

    /**
     * 用于 加好友请求 FirendRequest 事件，
     * 将在 data 置两个方法，data.agree() 同意，data.refuse() 拒绝
     */
    friendRequestProcessor () {
        this.queue.push((data, next) => {
            if (data.post_type != 'request' || !data.hasOwnProperty('request_type') || data.request_type != 'friend')
                return next()
            
            const base_url = data.bot.getBaseUrl()
            const flag = data.flag
            
            data.agree = () => {
                return setFriendAddRequest({ base_url, flag })
            }

            data.refuse = () => {
                return setFriendAddRequest({ base_url, flag, approve: false })
            }

            next()
        })
        return this
    }

    /**
     * 用于 加群请求 / 邀请 GroupRequest 事件
     * 将在 data 置两个方法，data.agree() 同意，data.refuse() 拒绝
     */
    memberJoinReqeustProcessor () {
        this.queue.push((data, next) => {
            if (
                data.post_type != 'request' ||
                !data.hasOwnProperty('request_type') ||
                !data.hasOwnProperty('sub_type') ||
                data.request_type != 'group' ||
                (
                    data.sub_type != 'add' &&
                    data.sub_type != 'invite'
                )
            ) return next()

            const base_url = data.bot.getBaseUrl()
            const flag = data.flag
            const sub_type = data.sub_type

            data.agree = () => {
                return setGroupAddRequest({ base_url, flag, sub_type })
            }

            data.refuse = () => {
                return setGroupAddRequest({ base_url, flag, sub_type, approve: false })
            }

            next()
        })
        return this
    }

    /**
     * 自定义中间件
     * @param callback (data, next) => void 自行决定是否通过 next 流转到下一中间件
     */
    use (callback: (data: any, next: any) => any) {
        this.queue.push((data, next) => {
            callback(data, next)
        })
        return this
    }

    /**
     * 执行中间件，必须通过 done 来生成最终的中间件处理器
     * @param callback (data) => void
     */
    done (callback: (data: any) => any) {
        if (callback instanceof Function) this.queue.push((data) => {
            callback(data)
        })

        return (data: any) => {
            const dispath = (index: number) => {
                if (index == this.queue.length) return
                const route = this.queue[index]
                const next = () => dispath(index + 1)
                return route(data, next)
            }
            dispath(0)
        }
    }
}