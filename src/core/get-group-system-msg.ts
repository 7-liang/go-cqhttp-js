import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetGroupSystemMsgOpts {
    base_url: string
}

export interface GetGroupSystemMsgResult {
    invited_requests: GetGroupSystemMsgResult_InvitedRequest[] | null
    join_requests: GetGroupSystemMsgResult_JoinRequest[] | null
}

interface GetGroupSystemMsgResult_InvitedRequest {
    request_id: number
    invitor_uin: number
    invitor_nick: string
    group_id: number
    group_name: string
    checked: boolean
    actor: number
}

interface GetGroupSystemMsgResult_JoinRequest {
    request_id: number
    requester_uin: number
    requester_nick: string
    message: string
    group_id: number
    group_name: string
    checked: boolean
    actor: number
}

export default (opts: GetGroupSystemMsgOpts): Promise<GetGroupSystemMsgResult> => new Promise((resolve, reject) => {
    const { base_url } = opts
    if (!base_url) throw new Error('get-group-system-msg: 缺少必要的 base_url 参数。')

    axios.get(`${base_url}/get_group_system_msg`)
        .then(result => {
            if (!result) throw new Error('get-group-system-msg: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-system-msg: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})