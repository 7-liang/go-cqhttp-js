import Server from './utils/server'
import Message from './message'

import { BotEventType, BotEventProcessor } from './base-type'

import { SendMsgResult } from './core/send-private-msg'
import { GetMsgResult } from './core/get-msg'
import { GetImageResult } from './core/get-image'
import { GetLoginInfoResult } from './core/get-login-info'
import { QidianGetAccountInfoResult } from './core/qidian-get-accout-info'
import { GetStrangerInfoResult } from './core/get-stranger-info'
import { GetFriendListResult } from './core/get-friend-list'
import { GetGroupInfoResult } from './core/get-group-info'
import { GetGroupMemberInfoResult } from './core/get-group-member-info'
import { GetGroupHonorInfoResult, GroupHonorType } from './core/get-group-honor-info'
import { CanSendImageResult } from './core/can-send-image'
import { GetVersionInfoResult } from './core/get-version-info'
import { GetGroupSystemMsgResult } from './core/get-group-system-msg'
import { GetGroupFileSystemInfoResult } from './core/get-group-file-system-info'
import { GetGroupRootFilesResult } from './core/get-group-root-files'
import { GetGroupFilesByFolderResult } from './core/get-group-files-by-folder'
import { GetGroupFileUrlResult } from './core/get-group-file-url'
import { GetStatusResult } from './core/get-status'
import { GetGroupAtAllRemainResult } from './core/get-group-at-all-remain'
import { GetVipInfoResult } from './core/get-vip-info'
import { DownloadFileResult } from './core/download-file'
import { GetOnlineClientsResult } from './core/get-online-clients'
import { GetGroupMsgHistoryResult } from './core/get-group-msg-history'
import { GroupEssenceMsg } from './core/get-essence-msg-list'
import { CheckUrlSafelyResult } from './core/check-url-safely'
import { GetModelShowResult } from './core/get-model-show'

export default class Bot {
    constructor (config: { base_url: string, reverse_port: number, qq: number })

    getBaseUrl (): string
    getReversePort (): number
    getBotQQ (): number

    private __runProcessor (eventName: string, eventData: any): void
    private __reServerListen (): void

    on (eventType: BotEventType | BotEventType[], callback: BotEventProcessor): any
    one (eventType: BotEventType | BotEventType[], callback: BotEventProcessor): any
    off (eventType: BotEventType, handle?: string | number): void
    offAll (eventType: BotEventType | BotEventType[]): void

    /**
     * 发送私聊、群聊、群临时会话消息
     * @param {number} opts.user_id 好友或临时会话对象 QQ 号
     * @param {number} opts.group_id 群号，如没有 temp，填入此项刚代表发送群消息
     * @param {boolean} opts.temp 可选，临时会话标志，如需发临时会话，则 temp, group_id, user_id 都需要
     * @param {Message} opts.message Message 消息实例
     * @returns {Promise<SendMsgResult>} message_id 
     */
    sendMessage (opts: { user_id: number, group_id: number, temp?: boolean, message: Message }): Promise<SendMsgResult>

    /**
     * 撤回消息
     * @param {number} opts.message_id 需要撤回的消息 ID
     */
    recallMessage (opts: { message_id: number }): Promise<void>

    /**
     * 获取消息
     * @param {number} opts.message_id 消息 ID
     * @returns {Promise<GetMsgResult>} 消息
     */
    getMessage (opts: { message_id: number }): Promise<GetMsgResult>

    /**
     * 获取图片信息
     * @param {string} opts.file 图片缓存文件名f 
     * @returns {Promise<GetImageResult>} 图片信息
     */
    getImage (opts: { file: string }): Promise<GetImageResult>

    /**
     * 群组踢人
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 要踢的人 QQ
     * @param {boolean} opts.reject_add_request 默认 false，是否拒绝此人加群
     */
    memberKick (opts: { group_id: number, user_id: number, reject_add_request?: boolean }): Promise<void>

    /**
     * 群组单人禁言
     * @param {number} opts.group_id 要操作的群号
     * @param {number} opts.user_id 要禁言的对象 QQ
     * @param {number} opts.duration 可选，禁言时长，默认 1800 秒
     */
    groupBan (opts: { group_id: number, user_id: number, duration?: number }): Promise<void> 

    /**
     * 群组全员禁言
     * @param {number} opts.group_id 要操作的群号
     * @param {boolean} enable 默认 true, 开启禁言 
     */
    groupBanAll (opts: { group_id: number, enable?: boolean }): Promise<void>

    /**
     * 设置群管理员
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 要设置的管理员 QQ
     * @param {boolean} opts.enable 可选，默认 true 为设置，false 取消
     */
    setGroupAdmin (opts: { group_id: number, user_id: number, enable?: boolean }): Promise<void>

    /**
     * 设置用户群名片
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 要操作的用户 QQ
     * @param {number} opts.card 可选，名片内容，默认空，清空名片
     */
    setMemberCard (opts: { group_id: number, user_id: number, card?: string }): Promise<void>

    /**
     * 设置群名称
     * @param {number} opts.group_id 群号
     * @param {string} opts.group_name 群名称
     */
    setGroupName (opts: { group_id: number, group_name: string }): Promise<void>

    /**
     * 退出群组
     * @param {number} opts.group_id 要退出的群号
     * @param {boolean} opts.is_dismiss 可选，默认 false 不解散该群，true 退出并解散 
     */
    groupLeave (opts: { group_id: number, is_dismiss?: boolean }): Promise<void>

    /**
     * 设置群组专用头衔
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 要设置的用户QQ
     * @param {string} opts.special_title 可选，头衔，默认为空，表示清空用户头衔
     * @param {number} opts.duration 可选，默认 -1 表示永不过期，有效单位 秒
     */
    setMemberTitle (opts: { group_id: number, user_id: number, special_title?: string, duration?: number }): Promise<void>

    /**
     * 处理添加好友请求
     * @param {string} opts.flag 添加好友请求的 flag，从请求数据中获取
     * @param {boolean} opts.approve 可选，默认 true 同意，false 拒绝
     * @param {string} opts.remark 可选，通过后的好友备注
     */
    setFriendRequest (opts: { flag: string, approve?: boolean, remark?: string }): Promise<void>

    /**
     * 处理加群请求/邀请
     * @param {string} opts.flag 加群请求的 flag, 从请求数据中获取 
     * @param {string} opts.sub_type 请求类型，需要和上报请求一致
     * @param {boolean} opts.approve 可选，默认 true 同意
     * @param {string} opts.reason 可选，拒绝理由
     */
    setMemberJoinRequest (opts: { flag: string, sub_type: string, approve?: boolean, reason?: string }): Promise<void>

    /**
     * 获取登陆的 bot 信息
     * @returns {Promise<GetLoginInfoResult>} 返回 user_id, nickname
     */
    getLoginInfo (): Promise<GetLoginInfoResult>

    /**
     * 获取企点帐号信息，企点专用
     * @returns {Promise<QidianGetAccountInfoResult>} 返回 master_id, ext_name, create_time
     */
    getQidianAccountInfo (): Promise<QidianGetAccountInfoResult>

    /**
     * 获取陌生人信息
     * @param {number} opts.user_id QQ
     * @param {boolean} opts.no_cache 可选，默认 false 不使用缓存
     * @returns {Promise<GetStrangerInfoResult>} 返回 陌生人数据信息
     */
    getStrangerInfo (opts: { user_id: number, no_cache?: boolean }): Promise<GetStrangerInfoResult>

    /**
     * 获取好友列表
     * @returns {Promise<GetFriendListResult[]>} 返回好友列表
     */
    getFriendList (): Promise<GetFriendListResult>

    /**
     * 删除好友
     * @param {number} opts.friend_id 要删除的好友 QQ
     */
    deleteFriend (opts: { friend_id: number }): Promise<void>

    /**
     * 获取群信息
     * @param {number} opts.group_id 群号
     * @param {boolean} opts.no_cache 可选，默认 false 不使用缓存 
     * @returns {Promise<GetGroupInfoResult>} 返回群信息 Promise
     */
    getGroupInfo (opts: { group_id: number, no_cache?: boolean }): Promise<GetGroupInfoResult>

    /**
     * 获取群列表
     * @returns {Promise<GetGroupInfoResult[]>} 返回群信息数组列表 
     */
    getGroupList (): Promise<GetGroupInfoResult[]>

    /**
     * 获取群成员信息
     * @param {number} opts.group_id 群号
     * @param {number} opts.user_id 成员 QQ 号 
     * @param {boolean} opts.cache 可选，默认 false 不使用缓存
     * @returns {Promise<GetGroupMemberInfoResult>} 成员信息
     */
    getMemberInfo (opts: { group_id: number, user_id: number, no_cache?: boolean }): Promise<GetGroupMemberInfoResult>

    /**
     * 获取群成员列表信息
     * @param {number} opts.group_id 群号 
     * @returns {Promise<GetGroupMemberInfoResult[]>} 群成员列表信息数组
     */
    getMemberList (opts: { group_id: number }): Promise<GetGroupMemberInfoResult[]>

    /**
     * 获取群荣誉信息
     * @param {number} opts.group_id 群号
     * @param {GroupHonorType} opts.type 要获取的群荣誉类型，talkative, performer, legend, strong_newbie, emotion, all 
     * @returns {Promise<GetGroupHonorInfoResult>} 群荣誉数据
     */
    getHonorInfo (opts: { group_id: number, type: GroupHonorType }): Promise<GetGroupHonorInfoResult>

    /**
     * 检查是否可以发送图片
     * @returns {Promise<CanSendImageResult>} 返回 yes 字符 boolean 类型
     */
    canSendImage (): Promise<CanSendImageResult>

    /**
     * 获取版本信息
     * @returns {Promise<GetVersionInfoResult>} 
     */
    getVersion (): Promise<GetVersionInfoResult>

    /**
     * 重启 go-cqhttp (貌似无效)
     * @param {number} opts.delay? 可选，延迟重启，单位 毫秒
     */
    setRestart (opts: { delay?: number }): Promise<void>

    /**
     * 设置群头像
     * @param {number} opts.group_id 群号
     * @param {string} opts.file 头像图片文件名
     * @param {number} opts.cache? 可选，表示是否使用已缓存的文件，默认 1 使用，0 关闭
     */
    setGroupPortrait (opts: { group_id: number, file: string, cache?: number }): Promise<void>

    /**
     * 获取群系统消息
     * @returns {Promise<GetGroupSystemMsgResult>} 群系统消息 
     */
    getGroupSysMsg (): Promise<GetGroupSystemMsgResult>

    /**
     * 上传群文件
     * @param {number} opts.group_id 群号
     * @param {string} opts.file 本地文件路径
     * @param {string} opts.name 储存名称
     * @param {string} opts.folder 父目录 ID
     */
    uploadGroupFile (opts: { group_id: number, file: string, name: string, folder: string }): Promise<void>

    /**
     * 获取群文件系统信息
     * @param {number} opts.group_id 群号 
     * @returns {Promise<GetGroupFileSystemInfoResult>} 群文件系统信息
     */
    getGroupFileSysInfo (opts: { group_id: number }): Promise<GetGroupFileSystemInfoResult>

    /**
     * 获取群根目录文件列表
     * @param {number} opts.group_id 群号
     * @returns {Promise<GetGroupRootFilesResult>} 群根目录文件列表
     */
    getGroupRootFiles (opts: { group_id: number }): Promise<GetGroupRootFilesResult>

    /**
     * 获取群子目录文件列表
     * @param {number} opts.group_id 群号
     * @param {string} opts.folder_id 文件夹 ID，非文件夹名称，从 bot.getGroupRootFiles 获取
     * @returns {Promise<GetGroupFilesByFolderResult>} 群子目录文件列表
     */
    getGroupFolderFiles (opts: { group_id: number, folder_id: string }): Promise<GetGroupFilesByFolderResult>

    /**
     * 获取群文件资源链接
     * @param {number} opts.group_id 群号
     * @param {string} opts.file_id 文件 ID，非文件名
     * @param {number} opts.busid 文件类型 
     * @returns {Promise<GetGroupFileUrlResult>} 群文件资源 url
     */
    getGroupFileUrl (opts: { group_id: number, file_id: string, busid: number }): Promise<GetGroupFileUrlResult>

    /**
     * 获取 Bot 运行状态
     * @returns {Promise<GetStatusResult>} 运行状态
     */
    getStatus (): Promise<GetStatusResult>

    /**
     * 获取群 @全体成员 剩余次数
     * @param {number} opts.group_id 群号
     * @returns {Promise<GetGroupAtAllRemainResult>} @全体成员 剩余次数信息
     */
    getAtAllRemain (opts: { group_id: number }): Promise<GetGroupAtAllRemainResult>

    /**
     * 获取 VIP 信息
     * @param {number} opts.user_id 要操作的对象 QQ 
     * @returns {Promise<GetVipInfoResult>} vip 信息
     */
    getVipInfo (opts: { user_id: number }): Promise<GetVipInfoResult>

    /**
     * 发送群公告
     * @param {number} opts.group_id 群号
     * @param {string} opts.content 公告内容
     * @param {string} opts.image? 可选，图片路径 
     */
    sendGroupNotice (opts: { group_id: number, content: string, image?: string }): Promise<void>

    /**
     * 重载事件过滤器
     * @param {string} opts.file 事件过滤器文件
     */
    reloadEventFilter (opts: { file: string }): Promise<void>

    /**
     * 下载文件到缓存目录
     * @param {string} opts.url 链接地址
     * @param {number} opts.thread_count 下载线程数
     * @param {string | string[]} 自定义请求头
     * @returns {Promise<DownloadFileResult>} 下载文件的绝对路径
     */
    downloadFile (opts: { url: string, thread_count: number, headers: string | string[] }): Promise<DownloadFileResult>

    /**
     * 获取当前帐号在线客户端列表
     * @param {boolean} opts.no_cache? 可选，默认 true 无视缓存
     * @returns {Promise<GetOnlineClientsResult>} 在线设备列表
     */
    getOnlineClients (opts: { no_cache?: boolean }): Promise<GetOnlineClientsResult>

    /**
     * 获取群消息历史记录
     * @param {number} opts.group_id 群号
     * @param {number} opts.message_seq? 可选，起始消息序号
     * @returns {Promise<GetGroupMsgHistoryResult>} 历史消息列表
     */
    getGroupMsgHistory (opts: { group_id: number, message_seq?: number }): Promise<GetGroupMsgHistoryResult>

    /**
     * 设置精华消息
     * @param {number} opts.message_id 消息 ID
     */
    setEssenceMsg (opts: { message_id: number }): Promise<void>

    /**
     * 删除精华消息
     * @param {number} opts.message_id 消息 ID 
     */
    deleteEssenceMsg (opts: { message_id: number }): Promise<void>

    /**
     * 获取指定群的精华消息列表
     * @param {number} opts.group_id 群号 
     * @returns {Promise<GroupEssenceMsg[]>} 精华消息列表数组
     */
    getEssenceMsgList (opts: { group_id: number }): Promise<GroupEssenceMsg[]>

    /**
     * 检查链接安全性
     * @param {string} opts.url 要检查的链接
     * @returns {Promise<CheckUrlSafelyResult>} 安全等级：1 安全，2 未知，3 危险
     */
    checkUrlSafely (opts: { url: string }): Promise<CheckUrlSafelyResult>

    /**
     * 获取在线机型 
     * @param {string} opts.model 机型名称 
     * @returns {Promise<GetModelShowResult>}
     */
    getModelShow (opts: { model: string }): Promise<GetModelShowResult>

    /**
     * 设置在线机型 
     * @param {string} opts.model 机型名称
     * @param {string} opts.model_show
     */
    setModelShow (opts: { model: string, model_show: string }): Promise<void>

}