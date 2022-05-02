import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface DeleteMsgOpts {
    base_url: string
    message_id: number
}

export default (opts: DeleteMsgOpts) => new Promise((resolve, reject) => {
    const { base_url, message_id } = opts
    if (!message_id || !base_url) throw new Error(`delete-msg: 缺少必要的 ${getInvalidParams({
        message_id, base_url
    })} 参数。`)

    axios.get(`${base_url}/delete_msg`, { params: { message_id } })
        .then(result => {
            if (!result) throw new Error('delete-msg: 接口调用失败。')
            return resolve(true)
        }).catch(err => reject(err.message))
})
