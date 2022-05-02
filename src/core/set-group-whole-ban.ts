import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupWholeBanOpts {
    base_url: string
    group_id: number
    enable?: boolean
}

export default (opts: SetGroupWholeBanOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, enable = true } = opts
    if (!base_url || !group_id) throw new Error(`set-group-whole-ban: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/set_group_whole_ban`, { params: { group_id, enable } })
        .then(result => {
            if (!result) throw new Error('set-group-whole-ban: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-whole-ban: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})