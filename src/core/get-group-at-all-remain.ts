import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetGroupAtAllRemainOpts {
    base_url: string
    group_id: number
}

export interface GetGroupAtAllRemainResult {
    can_at_all: boolean
    remain_at_all_count_for_group: number
    remain_at_all_count_for_uin: number
}

export default (opts: GetGroupAtAllRemainOpts): Promise<GetGroupAtAllRemainResult> => new Promise((resolve, reject) => {
    const { base_url, group_id } = opts
    if (!base_url || !group_id) throw new Error(`get-group-at-all-remain: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/get_group_at_all_remain`, { params: { group_id } })
        .then(result => {
            if (!result) throw new Error(`get-group-at-all-remain: 接口调用失败。`)
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-at-all-remain: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})