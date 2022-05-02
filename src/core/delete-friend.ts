import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface DeleteFriendOpts {
    base_url: string
    friend_id: number
}

export default (opts: DeleteFriendOpts) => new Promise((resolve, reject) => {
    const { base_url, friend_id } = opts
    if (!base_url || !friend_id) throw new Error(`delete-friend: 缺少必要的 ${getInvalidParams({
        base_url, friend_id
    })} 参数。`)

    axios.get(`${base_url}/delete_friend`)
        .then(result => {
            if (!result) throw new Error('delete-friend: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`delete-friend: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})