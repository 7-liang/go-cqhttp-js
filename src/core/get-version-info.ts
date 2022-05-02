import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetVersionInfoOpts {
    base_url: string
}

export interface GetVersionInfoResult {
    app_name: string
    app_version: string
    app_full_name: string
    protocol_version: string
    coolq_edition: string
    coolq_directory: string
    "go-cqhttp": boolean
    plugin_version: string
    plugin_build_number: number
    plugin_build_configuration: string
    runtime_version: string
    runtime_os: string
    version: string
    protocol: number
}

export default (opts: GetVersionInfoOpts): Promise<GetVersionInfoResult> => new Promise((resolve, reject) => {
    const { base_url } = opts
    if (!base_url) throw new Error(`get-version-info: 缺少必要的 base_url 参数。`)

    axios.get(`${base_url}/get_version_info`)
        .then(result => {
            if (!result) throw new Error(`get-version-info: 接口调用失败。`)
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-version-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})