import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetOnlineClientsOpts {
    base_url: string
    no_cache?: boolean
}

export interface GetOnlineClientsResult {
    clients: OnlineClientDevice[]
}

interface OnlineClientDevice {
    app_id: number
    device_name: string
    device_kind: string
}

export default (opts: GetOnlineClientsOpts): Promise<GetOnlineClientsResult> => new Promise((resolve, reject) => {
    const { base_url, no_cache = true } = opts
    if (!base_url) throw new Error('get-online-clients: 缺少必要的 base_url 参数。')

    axios.get(`${base_url}/get_onlien_clients`, { params: { no_cache } })
        .then(result => {
            if (!result) throw new Error(`get-online-clients: 接口调用失败。`)
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-online-clients: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})