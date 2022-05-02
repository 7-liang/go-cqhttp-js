import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetGroupRootFilesOpts {
    base_url: string
    group_id: number
}

export interface GetGroupRootFilesResult {
    files: GroupFile[]
    folders: GroupFolder[]
}

export interface GroupFile {
    group_id: number
    file_id: string
    file_name: string
    busid: number
    file_size: number
    upload_time: number
    dead_time: number
    modify_time: number
    download_times: number
    uploader: number
    uploader_name: string
}

export interface GroupFolder {
    group_id: number
    folder_id: string
    folder_name: string
    create_time: number
    creator: number
    creator_name: string
    total_file_count: number
}

export default (opts: GetGroupRootFilesOpts): Promise<GetGroupRootFilesResult> => new Promise((resolve, reject) => {
    const { base_url, group_id } = opts
    if (!base_url || !group_id) throw new Error(`get-group-root-files: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/get_group_root_files`, { params: { group_id } })
        .then(result => {
            if (!result) throw new Error('get-group-root-files: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-root-files: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})