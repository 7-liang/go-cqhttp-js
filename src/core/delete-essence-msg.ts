import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface DeleteEssenceMsgOpts {
    base_url: string
    message_id: number
}

export default (opts: DeleteEssenceMsgOpts) => new Promise((resolve, reject) => {
    const { base_url, message_id } = opts
    if (!base_url || !message_id) throw new Error(`delete-essence-msg: 缺少必要的 ${getInvalidParams({
        base_url, message_id
    })} 参数。`)

    axios.get(`${base_url}/delete_essence_msg`, { params: { message_id } })
        .then(result => {
            if (!result) throw new Error(`delete-essence-msg: 接口调用失败。`)
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`delete-essence-msg: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})