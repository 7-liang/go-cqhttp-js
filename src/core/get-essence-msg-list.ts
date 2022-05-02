import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetEssenceMsgListOpts {
    base_url: string
    group_id: number
}

export interface GroupEssenceMsg {
    sender_id: number
    sender_nick: string
    sender_time: number
    operator_id: number
    operator_nick: string
    operator_time: number
    message_id: number
}

export default (opts: GetEssenceMsgListOpts): Promise<GroupEssenceMsg[]> => new Promise((resolve, reject) => {
    const { base_url, group_id } = opts
    if (!base_url || !group_id) throw new Error(`get-essence-msg-list: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/get_essence_msg_list`, { params: { group_id } })
        .then(result => {
            if (!result) throw new Error(`get-essence-msg-list: 接口调用失败。`)
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-essence-msg-list: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})