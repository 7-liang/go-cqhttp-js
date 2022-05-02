import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupAddRequestOpts {
    base_url: string
    flag: string
    sub_type: string
    approve?: boolean
    reason?: string
}

export default (opts: SetGroupAddRequestOpts) => new Promise((resolve, reject) => {
    const { base_url, flag, sub_type, approve = true, reason = '' } = opts
    if (!base_url || !flag || !sub_type) throw new Error(`set-group-add-request: 缺少必要的 ${getInvalidParams({
        base_url, sub_type, flag
    })} 参数。`)

    axios.get(`${base_url}/set_group_add_request`, { params: { flag, sub_type, approve, reason } })
        .then(result => {
            if (!result) throw new Error('set-group-add-request: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-add-request: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})