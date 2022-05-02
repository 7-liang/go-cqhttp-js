import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetGroupMsgHistoryOpts {
    base_url: string
    group_id: number
    message_seq?: number
}

export interface GetGroupMsgHistoryResult {
    messages: GroupMessageData[]
}

export interface GroupMessageData {
    anonymous: any
    font: number
    group_id: number
    message: string
    message_id: number
    message_seq: number
    message_type: string
    post_type: string
    self_id: number
    sender: {
        age: number
        area: string
        card: string
        level: string
        nickname: string
        role: string
        sex: string
        title: string
        user_id: number
    }
    sub_type: string
    time: number
    user_id: number
}

export default (opts: GetGroupMsgHistoryOpts): Promise<GetGroupMsgHistoryResult> => new Promise((resolve, reject) => {
    const { base_url, group_id, message_seq } = opts
    if (!base_url || !group_id ) throw new Error(`get-group-msg-history: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/get_group_msg_history`, { params: { group_id, message_seq } })
        .then(result => {
            if (!result) throw new Error('get-group-msg-history: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-msg-history: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})