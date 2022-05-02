import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetStrangerInfoOpts {
    base_url: string
    user_id: number
    no_cache?: boolean
}

export interface GetStrangerInfoResult {
    user_id: number
    nickname: string
    sex: string
    age: number
    qid: string
    level: number
    login_days: number
}

export default (opts: GetStrangerInfoOpts): Promise<GetStrangerInfoResult> => new Promise((resolve, reject) => {
    const { base_url, user_id, no_cache = false } = opts
    if (!base_url || !user_id) throw new Error(`get-stranger-info: 缺少必要的 ${getInvalidParams({
        base_url, user_id
    })} 参数。`)

    axios.get(`${base_url}/get_stranger_info`, { params: { user_id, no_cache } })
        .then(result => {
            if (!result) throw new Error('get-stranger-info: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-stranger-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})