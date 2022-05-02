import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetModelShowOpts {
    base_url: string
    model: string
    model_show: string
}

export default (opts: SetModelShowOpts) => new Promise((resolve, reject) => {
    const { base_url, model, model_show } = opts
    if (!base_url || !model || !model_show) throw new Error(`set-model-show: 缺少必要的 ${getInvalidParams({
        base_url, model, model_show
    })} 参数。`)

    axios.get(`${base_url}/_set_model_show`, { params: { model, model_show } })
        .then(result => {
            if (!result) throw new Error(`set-model-show: 接口调用失败。`)
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-model-show: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})