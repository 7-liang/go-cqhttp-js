import Server from './utils/server'
import getInvalidParams from './utils/get-invalid-params'
import snowflaker from './utils/snowflaker'
import Message from './message'

import _sendPrivateMsg, { SendMsgResult } from './core/send-private-msg'
import _sendGroupMsg from './core/send-group-msg'
import _deleteMsg from './core/delete-msg'
import _getMsg, { GetMsgResult } from './core/get-msg'
import _getImage, { GetImageResult } from './core/get-image'
import _setGroupKick from './core/set-group-kick'
import _setGroupBan from './core/set-group-ban'
import _setGroupWholeBan from './core/set-group-whole-ban'
import _setGroupAdmin from './core/set-group-admin'
import _setGroupCard from './core/set-group-card'
import _setGroupName from './core/set-group-name'
import _setGroupLeave from './core/set-group-leave'
import _setGroupSpecialTitle from './core/set-group-special-ttile'
import _setFriendAddRequest from './core/set-friend-add-request'
import _setGroupAddRequest from './core/set-group-add-request'
import _getLoginInfo, { GetLoginInfoResult } from './core/get-login-info'
import _qidianGetAccountInfo, { QidianGetAccountInfoResult } from './core/qidian-get-accout-info'
import _getStrangerInfo, { GetStrangerInfoResult } from './core/get-stranger-info'
import _getFriendList, { GetFriendListResult } from './core/get-friend-list'
import _deleteFriend from './core/delete-friend'
import _getGroupInfo, { GetGroupInfoResult } from './core/get-group-info'
import _getGroupList from './core/get-group-list'
import _getGroupMemberInfo, { GetGroupMemberInfoResult } from './core/get-group-member-info'
import _getGropuMemberList from './core/get-group-member-list'
import _getGroupHonorInfo, { GetGroupHonorInfoResult, GroupHonorType } from './core/get-group-honor-info'
import _canSendImage from './core/can-send-image'
import _getVersionInfo from './core/get-version-info'
import _setRestart from './core/set-restart'
import _setGroupPortrait from './core/set-group-portrait'
import _getGroupSystemMsg, { GetGroupSystemMsgResult } from './core/get-group-system-msg'
import _uploadGroupFile from './core/upload-group-file'
import _getGroupFileSystemInfo from './core/get-group-file-system-info'
import _getGroupRootFiles from './core/get-group-root-files'
import _getGroupFilesByFolder from './core/get-group-files-by-folder'
import _getGroupFileUrl from './core/get-group-file-url'
import _getStatus, { GetStatusResult } from './core/get-status'
import _getGroupAtAllRemain, { GetGroupAtAllRemainResult } from './core/get-group-at-all-remain'
import _getVipInfo from './core/get-vip-info'
import _sendGroupNotice from './core/send-group-notice'
import _reloadEventFilter from './core/reload_event_filter'
import _downloadFile from './core/download-file'
import _getOnlineClients, { GetOnlineClientsResult } from './core/get-online-clients'
import _getGroupMsgHistory, { GetGroupMsgHistoryResult } from './core/get-group-msg-history'
import _setEssenceMsg from './core/set-essence-msg'
import _deleteEssenceMsg from './core/delete-essence-msg'
import _getEssenceMsgList, { GroupEssenceMsg } from './core/get-essence-msg-list'
import _checkUrlSafely, { CheckUrlSafelyResult } from './core/check-url-safely'
import _getModelShow, { GetModelShowResult } from './core/get-model-show'
import _setModelShow from './core/set-model-show'

import { BotEventType, BotEventProcessor } from './base-type'

export default class Bot {
    private base_url: string
    private reverse_port: number
    private qq: number
    private server: Server
    private eventProcessorMap: any

    constructor (config: { base_url: string, reverse_port: number, qq: number }) {
        if (!config.qq) throw new Error('Bot 初始化缺少必要的 qq 参数。')

        this.base_url = config.base_url || 'http://127.0.0.1:5700'
        this.reverse_port = config.reverse_port || 5701
        this.qq = config.qq

        this.server = new Server({ port: this.reverse_port })
        this.eventProcessorMap = {}

        this.__reSeverListen()
    }

    // 执行指定的事件处理器
    private __runProcessor (eventName: string, eventData: any) {
        if (this.eventProcessorMap.hasOwnProperty(eventName)) {
            return Object.values(this.eventProcessorMap[eventName])
                .forEach((processor: any) => processor(eventData))
        }
    }

    // 监听反向 http 服务器接收到的 post 数据，并转发到相应的事件处理器执行
    private __reSeverListen () {
        this.server.on('Event', eventData => {
            // 添加 bot 实例
            eventData.bot = this
            switch (eventData.post_type) {
                // 上报类型为 消息
                case 'message':
                    const { message_type } = eventData
                    // eventData.message_chain = new Message().parse(eventData.message)
                    // 私聊消息
                    if (message_type == 'private') this.__runProcessor('PrivateMessage', eventData)
                    // 群聊消息
                    else if (message_type == 'group') this.__runProcessor('GroupMessage', eventData)
                    break

                // 上报类型为 通知
                case 'notice':
                    const { notice_type } = eventData
                    // 群文件上传
                    if (notice_type == 'group_upload') this.__runProcessor('GroupUploadNotice', eventData)
                    // 群管理员变动
                    else if (notice_type == 'group_admin') this.__runProcessor('GroupAdminNotice', eventData)
                    // 群成员减少
                    else if (notice_type == 'group_decrease') this.__runProcessor('GroupDecreaseNotice', eventData)
                    // 群成员增加
                    else if (notice_type == 'group_increase') this.__runProcessor('GroupIncreaseNotice', eventData)
                    // 群禁言
                    else if (notice_type == 'group_ban') this.__runProcessor('GroupBanNotice', eventData)
                    // 好友添加
                    else if (notice_type == 'friend_add') this.__runProcessor('FriendAddNotice', eventData)
                    // 群消息撤回
                    else if (notice_type == 'group_recall') this.__runProcessor('GroupRecallNotice', eventData)
                    // 好友消息撤回
                    else if (notice_type == 'friend_recall') this.__runProcessor('FriendRecallNotice', eventData)
                    // 戳一戳 / 红包王 / 成员荣誉变更
                    else if (notice_type == 'notify') {
                        const { sub_type } = eventData
                        // 好友戳一戳
                        if (sub_type == 'poke' && eventData.sender_id) this.__runProcessor('FriendPokeNotice', eventData)
                        // 群内戳一戳
                        else if (sub_type == 'poke' && eventData.group_id) this.__runProcessor('GroupPokeNotice', eventData)
                        // 群红包王
                        else if (sub_type == 'lucky_king') this.__runProcessor('LuckyKingNotice', eventData)
                        // 群成员荣誉变更
                        else if (sub_type == 'honor') this.__runProcessor('GroupHonorNotice', eventData)
                    }
                    // 群成员名片变更
                    else if (notice_type == 'group_card') this.__runProcessor('GroupCardNotice', eventData)
                    // 收到离线文件
                    else if (notice_type == 'offline_file') this.__runProcessor('OfflineFileNotice', eventData)
                    // 其他客户端在线状态变更
                    else if (notice_type == 'client_status') this.__runProcessor('ClientStatusNotice', eventData)
                    // 精华消息
                    else if (notice_type == 'essence') this.__runProcessor('EssenceNotice', eventData)
                    break

                // 上报类型为 请求
                case 'request':
                    const { request_type } = eventData
                    // 加好友请求
                    if (request_type == 'friend') this.__runProcessor('FriendRequest', eventData)
                    // 加群请求
                    else if (request_type == 'group') this.__runProcessor('GroupRequest', eventData)
                    break

                default: break
            }
        })
    }

    /**
     * 添加事件处理器
     * @param {string | string[]} eventType 事件名称，可为数组
     * @param {function} callback 事件处理程序，回调函数
     * @returns {string} 事件处理器标识，用于移除该处理器
     */
    on (eventType: BotEventType | BotEventType[], callback: BotEventProcessor): any {
        if (!eventType || !callback) throw new Error(`on: 缺少必要的 ${getInvalidParams({ eventType, callback })} 参数。`)

        // 当 eventType 为数组时，遍历 进行适配
        if (Array.isArray(eventType)) return eventType.forEach(event => this.on(event, callback))

        // 事件处理器映射列表中，没有该事件，则为该事件插入一个空的对象 {}
        if (!this.eventProcessorMap.hasOwnProperty(eventType)) this.eventProcessorMap[eventType] = {}
    
        // 生成唯一的 事件处理器标识，用于移除该处理器
        const handle = snowflaker()
        // 添加事件处理器，每个事件可有多个处理器，每个处理器使用一个唯一的 handle 做为 key
        this.eventProcessorMap[eventType][handle] = callback
        return handle
    }

    /**
     * 添加一个只处理一次的事件处理器
     * @param {string | string[]} eventType 事件名称，可为数组
     * @param {function} callback 事件处理程序，回调函数
     */
    one (eventType: BotEventType | BotEventType[], callback: BotEventProcessor) {
        if (!eventType || !callback) throw new Error(`one：缺少必要的 ${getInvalidParams({ eventType, callback })} 参数。`)
        
        // 当 eventType 为数组时，遍历 进行适配
        if (Array.isArray(eventType)) return eventType.forEach(event => this.on(event, callback))

        // 事件处理器映射列表中，没有该事件，则为该事件插入一个空的对象 {}
        if (!this.eventProcessorMap.hasOwnProperty(eventType)) this.eventProcessorMap[eventType] = {}

        // 生成唯一的 事件处理器标识，用于移除该处理器
        const handle = snowflaker()
        
        const processor = (data: any) => {
            if (this.eventProcessorMap.hasOwnProperty(eventType)) delete(this.eventProcessorMap[eventType][handle])
            callback(data)
        }

        this.eventProcessorMap[eventType][handle] = processor
    }

    /**
     * 移除事件处理器
     * @param {string} eventType 事件名称
     * @param {string | number | string[] | number[]} handle 可选，事件处理器标识，由 on 方法返回，如未提供，则移除该事件下的所有处理器
     */
    off (eventType: BotEventType, handle?: string | number) {
        if (!eventType) throw new Error('off：缺少必要的 eventType 参数。')

        // 如没有 handle 参数，移除整个事件
        if (!handle) {
            if (this.eventProcessorMap.hasOwnProperty(eventType)) {
                delete(this.eventProcessorMap[eventType])
                return
            }
        }

        // 如 handle 为数组，则遍历移除相应的 处理器
        if (Array.isArray(handle)) {
            handle.forEach(item => {
                if (this.eventProcessorMap[eventType].hasOwnProperty(item))
                    delete(this.eventProcessorMap[eventType][item])
            })
        } else {
            if (this.eventProcessorMap[eventType].hasOwnProperty(handle))
                delete(this.eventProcessorMap[eventType][handle])
        }
    }

    /**
     * 移除全部或某个事件
     * @param {string | string[]} eventType 可选，要移除的事件名称，如未提供，则移除全部事件
     */
    offAll (eventType?: BotEventType | BotEventType[]) {
        if (!eventType) {
            this.eventProcessorMap = {}
            return
        }

        if (Array.isArray(eventType)) {
            eventType.forEach(item => {
                if (this.eventProcessorMap.hasOwnProperty(eventType))
                    delete(this.eventProcessorMap[eventType as any])
            })
        } else {
            if (this.eventProcessorMap.hasOwnProperty(eventType))
                delete(this.eventProcessorMap[eventType])
        }
    }

    /**
     * 发送私聊、群聊、群临时会话消息
     * @param {number} opts.user_id 好友或临时会话对象 QQ 号
     * @param {number} opts.group_id 群号，如没有 temp，填入此项刚代表发送群消息
     * @param {boolean} opts.temp 可选，临时会话标志，如需发临时会话，则 temp, group_id, user_id 都需要
     * @param {Message} opts.message Message 消息实例
     * @returns {Promise<SendMsgResult>} message_id 
     */
    sendMessage (opts: { user_id: number, group_id: number, temp?: boolean, message: Message }) {
        let { temp, user_id, group_id, message } = opts
        if (!user_id && !group_id) throw new Error(`sendMessage: 缺少必要的 ${getInvalidParams({ user_id, group_id })} 参数。`)
        if (!message) throw new Error(`sendMessage: 缺少必要的 ${getInvalidParams({ message })} 参数。`)

        if (temp) {
            return _sendPrivateMsg({ base_url: this.base_url, user_id, group_id, message: message.cq_code })
        } else if (group_id) {
            return _sendGroupMsg({ base_url: this.base_url, group_id, message: message.cq_code })
        } else if (user_id) {
            return _sendPrivateMsg({ base_url: this.base_url, user_id, message: message.cq_code })
        }
    }

    /**
     * 撤回消息
     * @param {number} opts.message_id 需要撤回的消息 ID
     */
    recallMessage (opts: { message_id: number }) {
        const { message_id } = opts
        if (!message_id) throw new Error(`recallMessage: 缺少必要的 ${getInvalidParams({ message_id })} 参数。`)       
        return _deleteMsg({ base_url: this.base_url, message_id })
    }

    /**
     * 获取消息
     * @param {number} opts.message_id 消息 ID
     * @returns {Promise<GetMsgResult>} 消息
     */
    getMessage (opts: { message_id: number }) {
        const { message_id } = opts
        if (!message_id) throw new Error(`getMessage: 缺少必要的 ${getInvalidParams({ message_id })} 参数。`)
        return _getMsg({ base_url: this.base_url, message_id })
    }

    /**
     * 获取图片信息
     * @param {string} opts.file 图片缓存文件名f 
     * @returns {Promise<GetImageResult>} 图片信息
     */
    getImage (opts: { file: string }) {
        const { file } = opts
        if (!file) throw new Error(`getImage: 缺少必要的 ${getInvalidParams({ file })} 参数。`)
        return _getImage({ base_url: this.base_url, file })
    }

    /**
     * 群组踢人
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 要踢的人 QQ
     * @param {boolean} opts.reject_add_request 默认 false，是否拒绝此人加群
     */
    memberKick (opts: { group_id: number, user_id: number, reject_add_request?: boolean }) {
        let { group_id, user_id, reject_add_request } = opts
        if (!group_id || !user_id) throw new Error(`memberKick: 缺少必要的 ${getInvalidParams({ group_id, user_id })} 参数。`)
        if (!reject_add_request) reject_add_request = false
        return _setGroupKick({ base_url: this.base_url, group_id, user_id, reject_add_request })
    }

    /**
     * 群组单人禁言
     * @param {number} opts.group_id 要操作的群号
     * @param {number} opts.user_id 要禁言的对象 QQ
     * @param {number} opts.duration 可选，禁言时长，默认 1800 秒
     */
    groupBan (opts: { group_id: number, user_id: number, duration?: number }) {
        let { group_id, user_id, duration } = opts
        if (!group_id || !user_id) throw new Error(`groupBan: 缺少必要的 ${getInvalidParams({ group_id, user_id })} 参数。`)
        if (!duration) duration = 1800
        return _setGroupBan({ base_url: this.base_url, group_id, user_id, duration })
    }

    /**
     * 群组全员禁言
     * @param {number} opts.group_id 要操作的群号
     * @param {boolean} enable 默认 true, 开启禁言 
     */
    groupBanAll (opts: { group_id: number, enable?: boolean }) {
        let { group_id, enable } = opts
        if (!group_id) throw new Error(`groupBanAll: 缺少必要的 ${getInvalidParams({ group_id })} 参数。`)
        if (typeof(enable) === 'undefined') enable = true
        return _setGroupWholeBan({ base_url: this.base_url, group_id, enable })
    }

    /**
     * 设置群管理员
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 要设置的管理员 QQ
     * @param {boolean} opts.enable 可选，默认 true 为设置，false 取消
     */
    setGroupAdmin (opts: { group_id: number, user_id: number, enable?: boolean }) {
        let { group_id, user_id, enable } = opts
        if (!group_id || !user_id) throw new Error(`setGroupAdmin: 缺少必要的 ${getInvalidParams({ group_id, user_id })} 参数。`)
        if (typeof(enable) === 'undefined') enable = true
        return _setGroupAdmin({ base_url: this.base_url, group_id, user_id, enable })
    }

    /**
     * 设置用户群名片
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 要操作的用户 QQ
     * @param {number} opts.card 可选，名片内容，默认空，清空名片
     */
    setMemberCard (opts: { group_id: number, user_id: number, card?: string }) {
        let { group_id, user_id, card } = opts
        if (!group_id || !user_id) throw new Error(`setMemberCard: 缺少必要的 ${getInvalidParams({ group_id, user_id })} 参数。`)
        if (typeof(card) === 'undefined') card = ''
        return _setGroupCard({ base_url: this.base_url, group_id, user_id, card })
    }

    /**
     * 设置群名称
     * @param {number} opts.group_id 群号
     * @param {string} opts.group_name 群名称
     */
    setGroupName (opts: { group_id: number, group_name: string }) {
        const { group_id, group_name } = opts
        if (!group_id || !group_name) throw new Error(`setGroupName: 缺少必要的 ${getInvalidParams({ group_id, group_name })} 参数。`)
        return _setGroupName({ base_url: this.base_url, group_id, group_name })
    }

    /**
     * 退出群组
     * @param {number} opts.group_id 要退出的群号
     * @param {boolean} opts.is_dismiss 可选，默认 false 不解散该群，true 退出并解散 
     */
    groupLeave (opts: { group_id: number, is_dismiss?: boolean }) {
        let { group_id, is_dismiss } = opts
        if (!group_id) throw new Error(`groupLeave: 缺少必要的 ${getInvalidParams({ group_id })} 参数。`)
        if (typeof(is_dismiss) === 'undefined') is_dismiss = false
        return _setGroupLeave({ base_url: this.base_url, group_id, is_dismiss })
    }

    /**
     * 设置群组专用头衔
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 要设置的用户QQ
     * @param {string} opts.special_title 可选，头衔，默认为空，表示清空用户头衔
     * @param {number} opts.duration 可选，默认 -1 表示永不过期，有效单位 秒
     */
    setMemberTitle (opts: { group_id: number, user_id: number, special_title?: string, duration?: number }) {
        let { group_id, user_id, special_title, duration } = opts
        if (!group_id || !user_id) throw new Error(`setMemberTitle: 缺少必要的 ${getInvalidParams({ group_id, user_id })} 参数。`)
        if (typeof(special_title) === 'undefined') special_title = ''
        if (typeof(duration) === 'undefined') duration = -1
        return _setGroupSpecialTitle({ base_url: this.base_url, group_id, user_id, special_title, duration })
    }

    /**
     * 处理添加好友请求
     * @param {string} opts.flag 添加好友请求的 flag，从请求数据中获取
     * @param {boolean} opts.approve 可选，默认 true 同意，false 拒绝
     * @param {string} opts.remark 可选，通过后的好友备注
     */
    setFriendRequest (opts: { flag: string, approve?: boolean, remark?: string }) {
        let { flag, approve, remark } = opts
        if (!flag) throw new Error(`setFriendRequest: 缺少必要的 flag 参数。`)
        if (typeof(approve) === 'undefined') approve = true
        if (typeof(remark) === 'undefined') remark = ''
        return _setFriendAddRequest({ base_url: this.base_url, flag, approve, remark })
    }

    /**
     * 处理加群请求/邀请
     * @param {string} opts.flag 加群请求的 flag, 从请求数据中获取 
     * @param {string} opts.sub_type 请求类型，需要和上报请求一致
     * @param {boolean} opts.approve 可选，默认 true 同意
     * @param {string} opts.reason 可选，拒绝理由
     */
    setMemberJoinRequest (opts: { flag: string, sub_type: string, approve?: boolean, reason?: string }) {
        let { flag, sub_type, approve, reason } = opts
        if (!flag || !sub_type) throw new Error(`setMemberJoinRequest: 缺少必要的 ${getInvalidParams({ flag, sub_type })} 请求。`)
        if (typeof(approve) === 'undefined') approve = true
        if (typeof(reason) === 'undefined') reason = ''
        return _setGroupAddRequest({ base_url: this.base_url, flag, sub_type, approve, reason })
    }

    /**
     * 获取登陆的 bot 信息
     * @returns {Promise<GetLoginInfoResult>} 返回 user_id, nickname
     */
    getLoginInfo () {
        return _getLoginInfo({ base_url: this.base_url })
    }

    /**
     * 获取企点帐号信息，企点专用
     * @returns {Promise<QidianGetAccountInfoResult>} 返回 master_id, ext_name, create_time
     */
    getQidianAccountInfo () {
        return _qidianGetAccountInfo({ base_url: this.base_url })
    }

    /**
     * 获取陌生人信息
     * @param {number} opts.user_id QQ
     * @param {boolean} opts.no_cache 可选，默认 false 不使用缓存
     * @returns {Promise<GetStrangerInfoResult>} 返回 陌生人数据信息
     */
    getStrangerInfo (opts: { user_id: number, no_cache?: boolean }) {
        let { user_id, no_cache } = opts
        if (!user_id) throw new Error('geStrangerInfo: 缺少必要的 user_id 参数。')
        if (typeof(no_cache)) no_cache = false
        return _getStrangerInfo({ base_url: this.base_url, user_id, no_cache })
    }

    /**
     * 获取好友列表
     * @returns {Promise<GetFriendListResult[]>} 返回好友列表
     */
    getFriendList () {
        return _getFriendList({ base_url: this.base_url })
    }

    /**
     * 删除好友
     * @param {number} opts.friend_id 要删除的好友 QQ
     */
    deleteFriend (opts: { friend_id: number }) {
        const { friend_id } = opts
        if (!friend_id) throw new Error(`deleteFriend: 缺少必要的 friend_id 参数。`)
        return _deleteFriend({ base_url: this.base_url, friend_id })
    }

    /**
     * 获取群信息
     * @param {number} opts.group_id 群号
     * @param {boolean} opts.no_cache 可选，默认 false 不使用缓存 
     * @returns {Promise<GetGroupInfoResult>} 返回群信息 Promise
     */
    getGroupInfo (opts: { group_id: number, no_cache?: boolean }) {
        let { group_id, no_cache } = opts
        if (!group_id) throw new Error(`getGroupInfo: 缺少必要的 group_id 参数。`)
        if (typeof(no_cache) === 'undefined') no_cache = false
        return _getGroupInfo({ base_url: this.base_url, group_id, no_cache })
    }

    /**
     * 获取群列表
     * @returns {Promise<GetGroupInfoResult[]>} 返回群信息数组列表 
     */
    getGroupList () {
        return _getGroupList({ base_url: this.base_url })
    }

    /**
     * 获取群成员信息
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 成员 QQ 号 
     * @param {boolean} opts.cache 可选，默认 false 不使用缓存
     * @returns {Promise<GetGroupMemberInfoResult>} 成员信息
     */
    getMemberInfo (opts: { group_id: number, user_id: number, no_cache?: boolean }) {
        let { group_id, user_id, no_cache } = opts
        if (!group_id || !user_id) throw new Error(`getMemberInfo: 缺少必要的 ${getInvalidParams({ group_id, user_id })} 参数。`)
        if (typeof(no_cache) === 'undefined') no_cache = false
        return _getGroupMemberInfo({ base_url: this.base_url, group_id, user_id, no_cache })
    }

    /**
     * 获取群成员列表信息
     * @param {number} opts.group_id 群号 
     * @returns {Promise<GetGroupMemberInfoResult[]>} 群成员列表信息数组
     */
    getMemberList (opts: { group_id: number }) {
        const { group_id } = opts
        if (!group_id) throw new Error(`getMemberList: 缺少必要的 group_id 参数。`)
        return _getGropuMemberList({ base_url: this.base_url, group_id })
    }

    /**
     * 获取群荣誉信息
     * @param {number} opts.group_id 群号
     * @param {GroupHonorType} opts.type 要获取的群荣誉类型，talkative, performer, legend, strong_newbie, emotion, all 
     * @returns {Promise<GetGroupHonorInfoResult>} 群荣誉数据
     */
    getHonorInfo (opts: { group_id: number, type: GroupHonorType }) {
        const { group_id, type } = opts
        if (!group_id || !type) throw new Error(`getHonorInfo: 缺少必要的 ${getInvalidParams({ group_id, type })} 参数。`)
        return _getGroupHonorInfo({ base_url: this.base_url, group_id, type })
    }

    /**
     * 检查是否可以发送图片
     * @returns {Promise<CanSendImageResult>} 返回 yes 字符 boolean 类型
     */
    canSendImage () {
        return _canSendImage({ base_url: this.base_url })
    }

    /**
     * 获取版本信息
     * @returns {Promise<GetVersionInfoResult>} 
     */
    getVersion () {
        return _getVersionInfo({ base_url: this.base_url })
    }

    /**
     * 重启 go-cqhttp (貌似无效)
     * @param {number} opts.delay? 可选，延迟重启，单位 毫秒
     */
    setRestart (opts: { delay?: number }) {
        let { delay } = opts
        if (typeof(delay) === 'undefined') delay = 0
        return _setRestart({ base_url: this.base_url, delay })
    }

    /**
     * 设置群头像
     * @param {number} opts.group_id 群号
     * @param {string} opts.file 头像图片文件名
     * @param {number} opts.cache? 可选，表示是否使用已缓存的文件，默认 1 使用，0 关闭
     */
    setGroupPortrait (opts: { group_id: number, file: string, cache?: number }) {
        let { group_id, file, cache } = opts
        if (!group_id || !file) throw new Error(`setGroupPortrait: 缺少必要的 ${getInvalidParams({ group_id, file })} 参数。`)
        if (typeof(cache) === 'undefined') cache = 1
        return _setGroupPortrait({ base_url: this.base_url, group_id, file, cache })
    }

    /**
     * 获取群系统消息
     * @returns {Promise<GetGroupSystemMsgResult>} 群系统消息 
     */
    getGroupSysMsg () {
        return _getGroupSystemMsg({ base_url: this.base_url })
    }

    /**
     * 上传群文件
     * @param {number} opts.group_id 群号
     * @param {string} opts.file 本地文件路径
     * @param {string} opts.name 储存名称
     * @param {string} opts.folder 父目录 ID
     */
    uploadGroupFile (opts: { group_id: number, file: string, name: string, folder: string }) {
        const { group_id, file, name, folder } = opts
        if (!group_id || !file || !name || folder) throw new Error(`uploadGroupFile: 缺少必要的 ${getInvalidParams({
            group_id, file, name, folder
        })} 参数。`)
        return _uploadGroupFile({ base_url: this.base_url, group_id, file, name, folder })
    }

    /**
     * 获取群文件系统信息
     * @param {number} opts.group_id 群号 
     * @returns {Promise<GetGroupFileSystemInfoResult>} 群文件系统信息
     */
    getGroupFileSysInfo (opts: { group_id: number }) {
        const { group_id } = opts
        if (!group_id) throw new Error(`getGroupFileSysInfo: 缺少必要的 group_id 参数。`)
        return _getGroupFileSystemInfo({ base_url: this.base_url, group_id })
    }

    /**
     * 获取群根目录文件列表
     * @param {number} opts.group_id 群号
     * @returns {Promise<GetGroupRootFilesResult>} 群根目录文件列表
     */
    getGroupRootFiles (opts: { group_id: number }) {
        const { group_id } = opts
        if (!group_id) throw new Error(`getGroupRootFiles: 缺少必要的 group_id 参数。`)
        return _getGroupRootFiles({ base_url: this.base_url, group_id })
    }

    /**
     * 获取群子目录文件列表
     * @param {number} opts.group_id 群号
     * @param {string} opts.folder_id 文件夹 ID，非文件夹名称，从 bot.getGroupRootFiles 获取
     * @returns {Promise<GetGroupFilesByFolderResult>} 群子目录文件列表
     */
    getGroupFolderFiles (opts: { group_id: number, folder_id: string }) {
        const { group_id, folder_id } = opts
        if (!group_id || !folder_id) throw new Error(`getGroupFolderFiles: 缺少必要的 ${getInvalidParams({
            group_id, folder_id
        })} 参数。`)
        return _getGroupFilesByFolder({ base_url: this.base_url, group_id, folder_id })
    }

    /**
     * 获取群文件资源链接
     * @param {number} opts.group_id 群号
     * @param {string} opts.file_id 文件 ID，非文件名
     * @param {number} opts.busid 文件类型 
     * @returns {Promise<GetGroupFileUrlResult>} 群文件资源 url
     */
    getGroupFileUrl (opts: { group_id: number, file_id: string, busid: number }) {
        const { group_id, file_id, busid } = opts
        if (!group_id || !file_id || !busid) throw new Error(`getGroupFileUrl: 缺少必要的 ${getInvalidParams({
            group_id, file_id, busid
        })} 参数。`)
        return _getGroupFileUrl({ base_url: this.base_url, group_id, file_id, busid })
    }

    /**
     * 获取 Bot 运行状态
     * @returns {Promise<GetStatusResult>} 运行状态
     */
    getStatus () {
        return _getStatus({ base_url: this.base_url })
    }

    /**
     * 获取群 @全体成员 剩余次数
     * @param {number} opts.group_id 群号
     * @returns {Promise<GetGroupAtAllRemainResult>} @全体成员 剩余次数信息
     */
    getAtAllRemain (opts: { group_id: number }) {
        const { group_id } = opts
        if (!group_id) throw new Error(`getAtAllRemain: 缺少必要的 group_id 参数。`)
        return _getGroupAtAllRemain({ base_url: this.base_url, group_id })
    }

    /**
     * 获取 VIP 信息
     * @param {number} opts.user_id 要操作的对象 QQ 
     * @returns {Promise<GetVipInfoResult>} vip 信息
     */
    getVipInfo (opts: { user_id: number }) {
        const { user_id } = opts
        if (!user_id) throw new Error('getVipInfo: 缺少必要的 user_id 参数。')
        return _getVipInfo({ base_url: this.base_url, user_id })
    }

    /**
     * 发送群公告
     * @param {number} opts.group_id 群号
     * @param {string} opts.content 公告内容
     * @param {string} opts.image? 可选，图片路径 
     */
    sendGroupNotice (opts: { group_id: number, content: string, image?: string }) {
        const { group_id, content, image } = opts
        if (!group_id || !content) throw new Error(`sendGroupNotice: 缺少必要的 ${getInvalidParams({
            group_id, content
        })} 参数。`)
        return _sendGroupNotice({ base_url: this.base_url, group_id, content, image })
    }

    /**
     * 重载事件过滤器
     * @param {string} opts.file 事件过滤器文件
     */
    reloadEventFilter (opts: { file: string }) {
        const { file } = opts
        if (!file) throw new Error(`reloadEventFilter: 缺少必要的 file 参数。`)
        return _reloadEventFilter({ base_url: this.base_url, file })
    }

    /**
     * 下载文件到缓存目录
     * @param {string} opts.url 链接地址
     * @param {number} opts.thread_count 下载线程数
     * @param {string | string[]} 自定义请求头
     * @returns {Promise<DownloadFileResult>} 下载文件的绝对路径
     */
    downloadFile (opts: { url: string, thread_count: number, headers: string | string[] }) {
        const { url, thread_count, headers } = opts
        if (!url || !thread_count || !headers) throw new Error(`downloadFile: 缺少必要的 ${getInvalidParams({
            url, thread_count, headers
        })} 参数。`)
        return _downloadFile({ base_url: this.base_url, url, thread_count, headers })
    }

    /**
     * 获取当前帐号在线客户端列表
     * @param {boolean} opts.no_cache? 可选，默认 true 无视缓存
     * @returns {Promise<GetOnlineClientsResult>} 在线设备列表
     */
    getOnlineClients (opts: { no_cache?: boolean }) {
        let { no_cache } = opts
        if (typeof(no_cache) === 'undefined') no_cache = true
        return _getOnlineClients({ base_url: this.base_url, no_cache })
    }

    /**
     * 获取群消息历史记录
     * @param {number} opts.group_id 群号
     * @param {number} opts.message_seq? 可选，起始消息序号
     * @returns {Promise<GetGroupMsgHistoryResult>} 历史消息列表
     */
    getGroupMsgHistory (opts: { group_id: number, message_seq?: number }) {
        const { group_id, message_seq } = opts
        if (!group_id) throw new Error(`getGroupMsgHistory: 缺少必要的 group_id 参数。`)
        return _getGroupMsgHistory({ base_url: this.base_url, group_id, message_seq })
    }

    /**
     * 设置精华消息
     * @param {number} opts.message_id 消息 ID
     */
    setEssenceMsg (opts: { message_id: number }) {
        const { message_id } = opts
        if (!message_id) throw new Error(`setEssenceMsg: 缺少必要的 message_id 参数。`)
        return _setEssenceMsg({ base_url: this.base_url, message_id })
    }

    /**
     * 删除精华消息
     * @param {number} opts.message_id 消息 ID 
     */
    deleteEssenceMsg (opts: { message_id: number }) {
        const { message_id } = opts
        if (!message_id) throw new Error(`deleteEssenceMsg: 缺少必要的 message_id 参数。`)
        return _deleteEssenceMsg({ base_url: this.base_url, message_id })
    }

    /**
     * 获取指定群的精华消息列表
     * @param {number} opts.group_id 群号 
     * @returns {Promise<GroupEssenceMsg[]>} 精华消息列表数组
     */
    getEssenceMsgList (opts: { group_id: number }) {
        const { group_id } = opts
        if (!group_id) throw new Error(`getEssenceMsgList: 缺少必要的 group_id 参数。`)
        return _getEssenceMsgList({ base_url: this.base_url, group_id })
    }

    /**
     * 检查链接安全性
     * @param {string} opts.url 要检查的链接
     * @returns {Promise<CheckUrlSafelyResult>} 安全等级：1 安全，2 未知，3 危险
     */
    checkUrlSafely (opts: { url: string }) {
        const { url } = opts
        if (!url) throw new Error(`checkUrlSafely: 缺少必要的 url 参数。`)
        return _checkUrlSafely({ base_url: this.base_url, url })
    }

    /**
     * 获取在线机型 
     * @param {string} opts.model 机型名称 
     * @returns {Promise<GetModelShowResult>}
     */
    getModelShow (opts: { model: string }) {
        const { model } = opts
        if (!model) throw new Error(`getModelShow: 缺少必要的 model 参数。`)
        return _getModelShow({ base_url: this.base_url, model })
    }

    /**
     * 设置在线机型 
     * @param {string} opts.model 机型名称
     * @param {string} opts.model_show
     */
    setModelShow (opts: { model: string, model_show: string }) {
        const { model, model_show } = opts
        if (!model || !model_show) throw new Error(`setModelShow: 缺少必要的 ${getInvalidParams({
            model, model_show
        })} 参数。`)
        return _setModelShow({ base_url: this.base_url, model, model_show })
    }

    getBaseUrl () {
        return this.base_url
    }
    getReversePort () {
        return this.reverse_port
    }
    getBotQQ () {
        return this.qq
    }
}
