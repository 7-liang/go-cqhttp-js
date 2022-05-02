import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"
import { GetGroupMemberInfoResult } from './get-group-member-info'

interface GetGroupMemberListOpts {
    base_url: string
    group_id: number
}

export default (opts: GetGroupMemberListOpts): Promise<GetGroupMemberInfoResult[]> => new Promise((resolve, reject) => {
    const { base_url, group_id } = opts
    if (!base_url || !group_id) throw new Error(`get-group-member-list: 缺少必要的 ${getInvalidParams({
        base_url, group_id
    })} 参数。`)

    axios.get(`${base_url}/get_group_member_list`, { params: { group_id } })
        .then(result => {
            if (!result) throw new Error('get-group-member-list: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-member-list: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})