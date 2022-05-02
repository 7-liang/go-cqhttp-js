import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

export type GroupHonorType = 'talkative' | 'performer' | 'legend' | 'strong_newbie' | 'emotion' | 'all'

export interface GetGroupHonorInfoResult {
    group_id: number
    current_talkative?: {
        user_id: number
        nickname: string
        avatar: string
        day_count: number
    }
    talkative_list?: GetGroupHonorInfoResult_Item[]
    performer_list?: GetGroupHonorInfoResult_Item[]
    legend_list?: GetGroupHonorInfoResult_Item[]
    strong_newbie_list?: GetGroupHonorInfoResult_Item[]
    emotion_list?: GetGroupHonorInfoResult_Item[]
}

interface GetGroupHonorInfoResult_Item {
    user_id: number
    nickname: string
    avatar: string
    description: string
}

interface GetGroupHonorInfoOpts {
    base_url: string
    group_id: number
    type: GroupHonorType
}

export default (opts: GetGroupHonorInfoOpts): Promise<GetGroupHonorInfoResult> => new Promise((resolve, reject) => {
    const { base_url, group_id, type } = opts
    if (!base_url || !group_id || !type) throw new Error(`get-group-honor-info: 缺少必要的 ${getInvalidParams({
        base_url, group_id, type
    })} 参数。`)

    axios.get(`${base_url}/get_group_honor_info`, { params: { group_id, type } })
        .then(result => {
            if (!result) throw new Error(`get-group-honor-info: 接口调用失败。`)
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-group-honor-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})

