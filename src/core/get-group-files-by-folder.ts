import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"
import { GroupFile, GroupFolder } from "./get-group-root-files"

interface GetGroupFilesByFolderOpts {
    base_url: string
    group_id: number
    folder_id: string
}

export interface GetGroupFilesByFolderResult {
    files: GroupFile[]
    folders: GroupFolder[]
}

export default (opts: GetGroupFilesByFolderOpts): Promise<GetGroupFilesByFolderResult> => new Promise((resolve, reject) => {
    const { base_url, group_id, folder_id } = opts
    if (!base_url || !group_id || !folder_id) throw new Error(`get-group-files-by-folder: 缺少必要的 ${getInvalidParams({
        base_url, group_id, folder_id
    })} 参数。`)

    axios.get(`${base_url}/get_group_files_by_folder`, { params: { group_id, folder_id } })
        .then(result => {
            if (!result) throw new Error('get-group-files-by-folder: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-files-by-folder: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})