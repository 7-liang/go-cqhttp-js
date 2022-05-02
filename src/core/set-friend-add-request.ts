import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetFriendAddRequestOpts {
    base_url: string
    flag: string
    approve?: boolean
    remark?: string
}

export default (opts: SetFriendAddRequestOpts) => new Promise((resolve, reject) => {
    const { base_url, flag, approve = true, remark = '' } = opts
    if (!base_url || !flag) throw new Error(`set-friend-add-request: 缺少必要的 ${getInvalidParams({
        base_url, flag
    })} 参数。`)

    axios.get(`${base_url}/set_friend_add_request`, { params: { flag, approve, remark } })
        .then(result => {
            if (!result) throw new Error('set-friend-add-request: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-friend-add-request: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})