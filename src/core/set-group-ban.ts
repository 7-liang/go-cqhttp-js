import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupBanOpts {
    base_url: string
    group_id: number
    user_id: number
    duration?: number
}

export default (opts: SetGroupBanOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, user_id, duration = 1800 } = opts
    if (!base_url || !group_id || user_id) throw new Error(`set-group-ban: 缺少必要的 ${getInvalidParams({
        base_url, group_id, user_id
    })} 参数。`)

    axios.get(`${base_url}/set_group_ban`, { params: { group_id, user_id, duration } })
        .then(result => {
            if (!result) throw new Error('set-group-ban: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-ban: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})