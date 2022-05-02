import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupAdminOpts {
    base_url: string
    group_id: number
    user_id: number
    enable?: boolean
}

export default (opts: SetGroupAdminOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, user_id, enable = true } = opts
    if (!base_url || !group_id || user_id) throw new Error(`set-group-admin: 缺少必要的 ${getInvalidParams({
        base_url, group_id, user_id
    })} 参数。`)

    axios.get(`${base_url}/set_group_admin`, { params: { group_id, user_id, enable } })
        .then(result => {
            if (!result) throw new Error(`set-group-admin: 接口调用失败。`)
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-admin: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})