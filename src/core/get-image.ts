import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetImageOpts {
    base_url: string
    file: string
}

export interface GetImageResult {
    file: string
    filename: string
    size: number
    url: string
}

export default (opts: GetImageOpts): Promise<GetImageResult> => new Promise((resolve, reject) => {
    const { base_url, file } = opts
    if (!base_url || !file) throw new Error(`get-image: 缺少必要的 ${getInvalidParams({
        base_url, file
    })} 参数。`)

    axios.get(`${base_url}/get_image`, { params: { file } })
        .then(result => {
            if (!result) throw new Error('get-image: 接口调用失败。')
            const { data, retcode, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-image: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})

/*
{
    "data":{
        "file":"data/cache/7806e5db3a6d5929e72093cd8a0e8b93.image.png",
        "filename":"`NY7OCUX$2P5%VWL}KW$D9K.png",
        "size":656,
        "url":"https://c2cpicdw.qpic.cn/offpic_new/987439//987439-1888768417-7806E5DB3A6D5929E72093CD8A0E8B93/0?term=3"
    },
    "retcode":0,
    "status":"ok"
}

{
    "data":null,
    "msg":"",
    "retcode":100,
    "status":"failed",
    "wording":""
}
*/
