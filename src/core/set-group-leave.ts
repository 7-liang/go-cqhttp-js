import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupLeaveOpts {
    base_url: string
    group_id: number
    is_dismiss?: boolean
}

export default (opts: SetGroupLeaveOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, is_dismiss = false } = opts
    if (!base_url || !group_id) throw new Error(`set-group-leave: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/set_group_leave`, { params: { group_id, is_dismiss } })
        .then(result => {
            if (!result) throw new Error('set-group-leave: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-leave: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})