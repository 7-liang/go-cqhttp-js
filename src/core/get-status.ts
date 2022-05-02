import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetStatusOpts {
    base_url: string
}

export interface GetStatusResult {
    app_initialized: boolean | null
    app_enabled: boolean | null
    plugins_good: boolean | null
    app_good: boolean | null
    online: boolean | null
    good: boolean | null
    stat: null | {
        PacketReceived: number
        PacketSent: number
        PacketLost: number
        MessageReceived: number
        MessageSent: number
        DisconnectTimes: number
        LostTimes: number
        LastMessageTime: number
    }
}

export default (opts: GetStatusOpts): Promise<GetStatusResult> => new Promise((resolve, reject) => {
    const { base_url } = opts
    if (!base_url) throw new Error('get-status: 缺少必要的 base_url 参数。')

    axios.get(`${base_url}/get_status`)
        .then(result => {
            if (!result) throw new Error('get-status: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-status: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})