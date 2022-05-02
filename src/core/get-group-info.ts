import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetGroupInfoOpts {
    base_url: string
    group_id: number
    no_cache?: boolean
}

export interface GetGroupInfoResult {
    group_id: number
    group_nmae: string
    group_memo: string
    group_create_time: number
    group_level: number
    member_count: number
    max_member_count: number
}

export default (opts: GetGroupInfoOpts): Promise<GetGroupInfoResult> => new Promise((resolve, reject) => {
    const { base_url, group_id, no_cache = false } = opts
    if (!base_url || !group_id) throw new Error(`get-group-info: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/get_group_info`, { params: { group_id, no_cache } })
        .then(result => {
            if (!result) throw new Error('get-group-info: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})