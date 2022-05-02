import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupNameOpts {
    base_url: string
    group_id: number
    group_name: string
}

export default (opts: SetGroupNameOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, group_name } = opts
    if (!base_url || !group_id || group_name) throw new Error(`set-group-name: 缺少必要的 ${getInvalidParams({
        base_url, group_id, group_name
    })} 参数。`)

    axios.get(`${base_url}/set_group_name`, { params: { group_id, group_name } })
        .then(result => {
            if (!result) throw new Error('set-group-name: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-name: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})
