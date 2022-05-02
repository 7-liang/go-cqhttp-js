import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetGroupFileUrlOpts {
    base_url: string
    group_id: number
    file_id: string
    busid: number
}

export interface GetGroupFileUrlResult {
    url: string
}

export default (opts: GetGroupFileUrlOpts): Promise<GetGroupFileUrlResult> => new Promise((resolve, reject) => {
    const { base_url, group_id, file_id, busid } = opts
    if (!base_url || !group_id || !file_id || !busid) throw new Error(`get-group-file-url: 缺少必要的 ${getInvalidParams({
        group_id, file_id, busid
    })} 参数。`)

    axios.get(`${base_url}/get_group_file_url`, { params: { group_id, file_id, busid } })
        .then(result => {
            if (!result) throw new Error(`get-group-file-url: 接口调用失败。`)
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-file-url: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})