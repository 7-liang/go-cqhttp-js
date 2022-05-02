interface EventBase {
    time: number
    self_id: number
    post_type: string | 'message' | 'notice' | 'request'
}



// 私聊消息
export interface PrivateMessageData extends EventBase {
    message_type: string | 'private'
    sub_type: string | 'friend' | 'group' | 'group_self' | 'other'
    temp_source: number
    message_id: number
    user_id: number
    message: string
    raw_message: string
    font: number
    sender: {
        user_id: number
        nickname: string
        sex: string |'male' | 'female' | 'unknown'
        age: number
    }
}

// 群聊消息
export interface GroupMessageData extends EventBase {
    message_type: string | 'group'
    sub_type: string | 'normal' | 'anonymous' | 'notice'
    message_id: number
    group_id: number
    user_id: number
    anonymous: null | {
        id: number
        name: string
        flag: string
    }
    message: string
    raw_message: string
    font: number
    sender: {
        user_id: number
        nickname: string
        card: string
        sex: string | 'male' | 'female' | 'unknown'
        age: number
        area: string
        level: string
        role: string | 'owner' | 'admin' | 'member'
        title: string
    }
}

// 群文件上传
export interface GroupUploadNoticeData extends EventBase {
    notice_type: string | 'group_upload'
    group_id: number
    user_id: number
    file: {
        id: string
        name: string
        size: number
        busid: number
    }
}

// 群管理员变动
export interface GroupAdminNoticeData extends EventBase {
    notice_type: string | 'group_admin'
    sub_type: string | 'set' | 'unset'
    group_id: number
    user_id: number
}

// 群成员减少
export interface GroupDecreaseNoticeData extends EventBase {
    notice_type: 'group_decrease'
    sub_type: 'leave' | 'kick' | 'kick_me'
    group_id: number
    operator_id: number
    user_id: number
}

// 群成员增加
export interface GroupIncreaseNoticeData extends EventBase {
    notice_type: 'group_increase'
    sub_type: 'approve' | 'invite'
    group_id: number
    operator_id: number
    user_id: number
}

// 群禁言
export interface GroupBanNoticeData extends EventBase {
    notice_type: 'group_ban'
    sub_type: 'ban' | 'lift_ban'
    group_id: number
    operator_id: number
    user_id: number
    duration: number
}

// 好友添加
export interface FriendAddNoticeData extends EventBase {
    notice_type: 'friend_add'
    user_id: number
}

// 群消息撤回
export interface GroupRecallNoticeData extends EventBase {
    notice_type: 'group_recall'
    group_id: number
    user_id: number
    operator_id: number
    message_id: number
}

// 好友消息撤回
export interface FriendRecallNoticeData extends EventBase {
    notice_type: 'friend_call'
    user_id: number
    message_id: number
}

// 好友戳一戳
export interface FriendPokeNoticeData {
    post_type: 'notice'
    notice_type: 'notify'
    sub_type: 'poke'
    self_id: number
    sender_id: number
    user_id: number
    target_id: number
    time: number
}

// 群内戳一戳
export interface GroupPokeNoticeData {
    post_type: 'notice'
    notice_type: 'notify'
    sub_type: 'poke'
    group_id: number
    user_id: number
    target_id: number
}

// 群红包王提示
export interface LuckyKingNoticeData {
    post_type: 'notice'
    notice_type: 'notify'
    group_id: number
    sub_type: 'lucky_king'
    user_id: number
    target_id: number
}

// 群成员荣誉变更
export interface GroupHonorNoticeData {
    post_type: 'notice'
    notice_type: 'notify'
    group_id: number
    sub_type: 'honor'
    user_id: number
    honor_type: string | 'talkative:龙王' | 'performer:群聊之火' | 'emotion:快乐源泉'
}

// 群成员名片更新
export interface GroupCardNoticeData {
    post_type: 'notice'
    notice_type: 'group_card'
    group_id: number
    user_id: number
    card_new: string
    card_old: string
}

// 接收到离线文件
export interface OfflineFileNoticeData {
    post_type: 'notice'
    notice_type: 'offline_file'
    user_id: number
    file: {
        name: string
        size: number
        url: string
    }
}

// 加好友请求
export interface FriendRequestData extends EventBase {
    request_type: 'friend'
    user_id: number
    comment: string
    flag: string
}

// 加群请求/邀请
export interface GroupRequestData extends EventBase {
    request_type: 'group'
    sub_type: 'add' | 'invite'
    group_id: number
    user_id: number
    comment: string
    flag: string
}

// 其他客户端在线状态变更
export interface ClientStatusNoticeData {
    post_type: 'notice'
    notice_type: 'client_status'
    client: {
        app_id: number
        device_name: string
        device_kind: string
    }
    online: boolean
}

// 精华消息
export interface EssenceNoticeData {
    post_type: 'notice'
    notice_type: 'essence'
    sub_type: 'add' | 'delete'
    sender_id: number
    operator_id: number
    message_id: number
}


// 监听的事件类型
export type BotEventType = 
    'PrivateMessage' | 'GroupMessage' | 'GroupUploadNotice' | 'GroupAdminNotice' | 'GroupDecreaseNotice' | 'GroupIncreaseNotice' |
    'GroupBanNotice' | 'FriendAddNotice' | 'GroupRecallNotice' | 'FriendRecallNotice' | 'FriendPokeNotice' | 'GroupPokeNotice' | 
    'LuckyKingNotice' | 'GroupHonorNotice' | 'GroupCardNotice' | 'OfflineFileNotice' | 'ClientStatusNotice' | 'EssenceNotice' |
    'FriendRequest' | 'GroupRequest'

// 事件处理器
export type BotEventProcessor = (
    data: PrivateMessageData | GroupMessageData | GroupUploadNoticeData | GroupAdminNoticeData | GroupDecreaseNoticeData |
        GroupIncreaseNoticeData | GroupBanNoticeData | FriendAddNoticeData | GroupRecallNoticeData | FriendRecallNoticeData |
        FriendPokeNoticeData | GroupPokeNoticeData | LuckyKingNoticeData | GroupHonorNoticeData | GroupCardNoticeData |
        OfflineFileNoticeData | ClientStatusNoticeData | EssenceNoticeData | FriendRequestData | GroupRequestData
) => Promise<any> | any