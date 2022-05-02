import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface QidianGetAccountInfoOpts {
    base_url: string
}

export interface QidianGetAccountInfoResult {
    master_id: number
    ext_name: string
    create_time: number
}

export default (opts: QidianGetAccountInfoOpts): Promise<QidianGetAccountInfoResult> => new Promise((resolve, reject) => {
    const { base_url } = opts
    if (!base_url) throw new Error(`qidian-get-account-info: 缺少必要的 ${getInvalidParams({ base_url })} 参数。`)

    axios.get(`${base_url}/qidian_get_account_info`)
        .then(result => {
            if (!result) throw new Error('qidian-get-account-info: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`qidian-get-account-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})