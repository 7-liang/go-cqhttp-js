import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SendGroupNoticeOpts {
    base_url: string
    group_id: number
    content: string
    image?: string
}

export default (opts: SendGroupNoticeOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, content, image = '' } = opts
    if (!base_url || !group_id || !content) throw new Error(`send-group-notice: 缺少必要的 ${getInvalidParams({
        base_url, group_id, content
    })} 参数。`)

    axios.get(`${base_url}/_send_group_notice`, { params: { group_id, content, image } })
        .then(result => {
            if (!result) throw new Error('send-group-notice: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`send-group-notice: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})