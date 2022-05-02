import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetFriendListOpts {
    base_url: string
}

export interface GetFriendListResult {
    user_id: number
    nickname: string
    remark: string
}

export default (opts: GetFriendListOpts): Promise<GetFriendListResult[]> => new Promise((resolve, reject) => {
    const { base_url } = opts
    if (!base_url) throw new Error(`get-friend-list: 缺少必要的 ${getInvalidParams({ base_url })} 参数。`)

    axios.get(`${base_url}/get_friend_list`)
        .then(result => {
            if (!result) throw new Error('get-friend-list: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-friend-list: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})