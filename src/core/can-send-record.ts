import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface CanSendRecordOpts {
    base_url: string
}

export default (opts: CanSendRecordOpts) => new Promise((resolve, reject) => {
    const { base_url } = opts
    if (!base_url) throw new Error('can-send-record: 缺少必要的 base_url 参数。')

    axios.get(`${base_url}/can_send_record`)
        .then(result => {
            if (!result) throw new Error('can-send-record: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`can-send-record: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})