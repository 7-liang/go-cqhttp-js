import { BotEventProcessor } from './base-type'

export default class Middleware {
    constructor ()

    /**
     * 归类指定类型的消息，置于 data.classified
     * @param {string[]} types 需要归类的消息类型，如 text, image, face 等
     */
    messageProcessor (types: string[]): this

    /**
     * 提取文本类 text 消息，拼接在一起，置于 data.text
     */
    textProcessor (): this

    /**
     * 过滤指定的群消息，决定是否通过
     * @param {number[]} groups 需要设置是否通过的群号
     * @param {boolean} allow 默认 true 通过，flase 禁止通过
     */
    groupFilter (groups: number[], allow: boolean): this

    /**
     * 过滤指定的用户消息，决定是否通过，如和 groupFilter 一起使用，则过滤群成员消息
     * @param {number[]} friends 需要过滤的 QQ 号
     * @param {boolean} allow 默认 true 通过，false 禁止通过
     */
    friendFilter (friends: number[], allow: boolean): this

    /**
     * 过滤 @ 消息，决定是否通过
     * @param {number[]} ats 需要通过的被 @ 人 QQ 号 
     * @param {boolean} allow 默认 true 通过，false 禁止通过
     */
    atFilter (ats: number[], allow: boolean): this

    /**
     * 用于 加好友请求 FirendRequest 事件，
     * 将在 data 置两个方法，data.agree() 同意，data.refuse() 拒绝
     */
    friendRequestProcessor (): this

    /**
     * 用于 加群请求 / 邀请 GroupRequest 事件
     * 将在 data 置两个方法，data.agree() 同意，data.refuse() 拒绝
     */
    memberJoinReqeustProcessor (): this

    use (callback: (data: any, next: any) => any): this

    done (callback: (data: any) => any): BotEventProcessor
}