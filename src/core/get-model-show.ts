import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetModelShowOpts {
    base_url: string
    model: string
}

export interface GetModelShowResult {
    variants: {
        model_show: string
        need_pay: boolean
    }[]
}

export default (opts: GetModelShowOpts): Promise<GetModelShowResult> => new Promise((resolve, reject) => {
    const { base_url, model } = opts
    if (!base_url || !model) throw new Error(`get-model-show: 缺少必要的 ${getInvalidParams({
        base_url, model
    })} 参数。`)

    axios.get(`${base_url}/_get_model_show`, { params: { model } })
        .then(result => {
            if (!result) throw new Error('get-model-show: 接口调用失败。')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-model-show: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})