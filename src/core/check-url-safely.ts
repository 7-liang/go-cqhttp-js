import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface CheckUrlSafelyOpts {
    base_url: string
    url: string
}

export interface CheckUrlSafelyResult {
    level: number
}

export default (opts: CheckUrlSafelyOpts): Promise<CheckUrlSafelyResult> => new Promise((resolve, reject) => {
    const { base_url, url } = opts
    if (!base_url || !url) throw new Error(`check-url-safely: 缺少必要的 ${getInvalidParams({
        base_url, url
    })} 参数。`)

    axios.get(`${base_url}/check_url_safely`, { params: { url } })
        .then(result => {
            if (!result) throw new Error(`check-url-safely: 接口调用失败。`)
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`check-url-safely: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})