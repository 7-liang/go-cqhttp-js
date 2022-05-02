import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface UploadGroupFileOpts {
    base_url: string
    group_id: number
    file: string
    name: string
    folder: string
}

export default (opts: UploadGroupFileOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, file, name, folder } = opts
    if (!base_url || !group_id || !file || !name || !folder) throw new Error(`upload-group-file: 缺少必要的 ${getInvalidParams({
        base_url, file, name, folder, group_id
    })} 参数。`)

    axios.get(`${base_url}/upload_group_file`, { params: { file, name, folder } })
        .then(result => {
            if (!result) throw new Error(`upload-group-file: 接口调用失败。`)
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`upload-group-file: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})