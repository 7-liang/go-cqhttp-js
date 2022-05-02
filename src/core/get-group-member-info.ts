import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetGroupMemberInfoOpts {
    base_url: string
    group_id: number
    user_id: number
    no_cache?: boolean
}

export interface GetGroupMemberInfoResult {
    group_id: number
    user_id: number
    nickname: string
    card: string
    age: number
    area: string
    join_time: number
    last_sent_time: number
    level: string
    role: string
    unfriendly: boolean
    title: string
    title_expire_time: number
    card_changeable: boolean
    shut_up_timestamp: number
}

export default (opts: GetGroupMemberInfoOpts): Promise<GetGroupMemberInfoResult> => new Promise((resolve, reject) => {
    const { base_url, group_id, user_id, no_cache = false } = opts
    if (!base_url || !group_id || !user_id) throw new Error(`get-group-member-info: 缺少必要的 ${getInvalidParams({
        base_url, group_id, user_id
    })} 参数。`)

    axios.get(`${base_url}/get_group_member_info`, { params: { group_id, user_id, no_cache } })
        .then(result => {
            if (!result) throw new Error('get-group-member-info: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-member-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})