import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface DownloadFileOpts {
    base_url: string
    url: string
    thread_count: number
    headers: string | string[]
}

export interface DownloadFileResult {
    file: string
}

export default (opts: DownloadFileOpts): Promise<DownloadFileResult> => new Promise((resolve, reject) => {
    const { base_url, url, thread_count, headers } = opts
    if (!base_url || !url || !thread_count || !headers) throw new Error(`download-file: 缺少必要的 ${getInvalidParams({
        base_url, url, thread_count, headers
    })} 参数。`)

    axios.get(`${base_url}/download_file`, { params: { url, thread_count, headers } })
        .then(result => {
            if (!result) throw new Error(`download-file: 接口调用失败。`)
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`download-file: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})