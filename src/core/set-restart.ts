import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SetRestartOpts {
    base_url: string
    delay?: number
}

export default (opts: SetRestartOpts) => new Promise((resolve, reject) => {
    const { base_url, delay = 0 } = opts
    if (!base_url) throw new Error('set-restart: 缺少必要的 base_url 参数。')

    axios.get(`${base_url}/set_restart`, { params: { delay } })
        .then(result => {
            if (!result) throw new Error('set-restart: 接口调用失败。')
            const { status, wording } = result.data
            if (status != 'ok') throw new Error(`set-restart: 接口调用失败，${wording}。`)
            return resolve(true)
        }).catch(err => reject(err.message))
})