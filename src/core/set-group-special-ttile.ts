import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupSpecialTitleOpts {
    base_url: string
    group_id: number
    user_id: number
    special_title?: string
    duration?: number
}

export default (opts: SetGroupSpecialTitleOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, user_id, special_title = '', duration = -1 } = opts
    if (!base_url || !group_id || !user_id) throw new Error(`set-group-special-title: 缺少必要的 ${getInvalidParams({
        base_url, group_id, user_id
    })} 参数。`)

    axios.get(`${base_url}/set_group_special_title`, { params: { group_id, user_id, special_title, duration } })
        .then(result => {
            if (!result) throw new Error('set-group-special-title: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-special-title: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})