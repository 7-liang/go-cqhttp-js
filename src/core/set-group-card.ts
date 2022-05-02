import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupCardOpts {
    base_url: string
    group_id: number
    user_id: number
    card: string
}

export default (opts: SetGroupCardOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, user_id, card = '' } = opts
    if (!base_url || !group_id || !user_id) throw new Error(`set-group-card: 缺少必要的 ${getInvalidParams({
        base_url, group_id, user_id
    })} 参数。`)

    axios.get(`${base_url}/set_group_card`, { params: { group_id, user_id, card } })
        .then(result => {
            if (!result) throw new Error('set-group-card: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-card: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})