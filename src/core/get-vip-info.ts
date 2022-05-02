import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetVipInfoOpts {
    base_url: string
    user_id: number
}

export interface GetVipInfoResult {
    user_id: number
    nickname: string
    level: number
    level_speed: number
    vip_level: string
    vip_growth_speed: number
    vip_growth_total: number
}

export default (opts: GetVipInfoOpts): Promise<GetVipInfoResult> => new Promise((resolve, reject) => {
    const { base_url, user_id } = opts
    if (!base_url || !user_id) throw new Error(`get-vip-info-opts: 缺少必要的 ${getInvalidParams({
        base_url, user_id
    })} 参数。`)

    axios.get(`${base_url}/_get_vip_info`, { params: { user_id } })
        .then(result => {
            if (!result) throw new Error('get-vip-info: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-vip-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})