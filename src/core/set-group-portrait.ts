import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetGroupPortraitOpts {
    base_url: string
    group_id: number
    file: string
    cache?: number
}

export default (opts: SetGroupPortraitOpts) => new Promise((resolve, reject) => {
    const { base_url, group_id, file, cache = 1 } = opts
    if (!base_url || !group_id || !file) throw new Error(`set-group-portrait: 缺少必要的 ${getInvalidParams({
        base_url, group_id, file
    })} 参数。`)

    axios.get(`${base_url}/set_group_portrait`, { params: { group_id, file, cache } })
        .then(result => {
            if (!result) throw new Error('set-group-portrait: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-group-portrait: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})