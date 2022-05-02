import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface ReloadEventFilterOpts {
    base_url: string
    file: string
}

export default (opts: ReloadEventFilterOpts) => new Promise((resolve, reject) => {
    const { base_url, file } = opts
    if (!base_url || !file) throw new Error(`reload-event-filter: 缺少必要的 ${getInvalidParams({
        base_url, file
    })} 参数。`)

    axios.get(`${base_url}/reload_event_filter`, { params: { file } })
        .then(result => {
            if (!result) throw new Error(`reload-event-filter: 接口调用失败。`)
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`reload-event-filter: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})