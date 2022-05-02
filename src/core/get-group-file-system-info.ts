import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetGroupFileSystemInfoOpts {
    base_url: string
    group_id: number
}

export interface GetGroupFileSystemInfoResult {
    file_count: number
    limit_count: number
    used_space: number
    total_space: number
}

export default (opts: GetGroupFileSystemInfoOpts): Promise<GetGroupFileSystemInfoResult> => new Promise((resolve, reject) => {
    const { base_url, group_id } = opts
    if (!base_url || !group_id) throw new Error(`get-group-file-system-info: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/get_group_file_system_info`, { params: { group_id } })
        .then(result => {
            if (!result) throw new Error('get-group-file-system-info: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-file-system-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})