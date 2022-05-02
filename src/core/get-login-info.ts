import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetLoginInfoOpts {
    base_url: string
}

export interface GetLoginInfoResult {
    user_id: number
    nickname: string
}

export default (opts: GetLoginInfoOpts): Promise<GetLoginInfoResult> => new Promise((resolve, reject) => {
    const { base_url } = opts
    if (!base_url) throw new Error(`get-login-info: 缺少必要的 ${getInvalidParams({ base_url })} 参数。`)

    axios.get(`${base_url}/get_login_info`)
        .then(result => {
            if (!result) throw new Error('get-login-info: 接口调用失败')
            const { data, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-login-info: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})