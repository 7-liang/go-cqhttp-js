import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupKickOpts {
    base_url: string
    group_id: number
    user_id: number
    reject_add_request?: boolean
}

export default (opts: SetGroupKickOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, user_id, reject_add_request = false } =  opts
    if (!base_url || !group_id || !user_id) throw new Error(`set-group-kick: 缺少必要的 ${getInvalidParams({
        base_url, group_id, user_id
    })} 参数。`)

    axios.get(`${base_url}/set_group_kick`, { params: { group_id, user_id, reject_add_request } })
        .then(result => {
            if (!result) throw new Error('set-group-kick: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-kick: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})

/*
{
    "data":null,
    "msg":"NOT_MANAGEABLE",
    "retcode":100,
    "status":"failed",
    "wording":"机器人权限不足"
}
*/
