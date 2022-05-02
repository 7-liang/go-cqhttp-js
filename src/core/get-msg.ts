import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface GetMsgOpts {
    base_url: string
    message_id: number
}

export interface GetMsgResult {
    group: boolean
    message: string
    message_id: number
    message_id_v2: string
    message_seq: number
    message_type: string
    real_id: number
    sender: {
        nickname: string
        user_id: number
    }
    time: number
}

export default (opts: GetMsgOpts): Promise<GetMsgResult> => new Promise((resolve, reject) => {
    const { base_url, message_id } = opts
    if (!base_url || !message_id) throw new Error(`get-msg: 缺少必要的 ${getInvalidParams({
        base_url, message_id
    })} 参数。`)

    axios.get(`${base_url}/get_msg`, { params: { message_id } })
        .then(result => {
            if (!result) throw new Error('get-msg: 接口调用失败。')
            const { data, retcode, status, wording } = result.data
            if (status != 'ok') throw new Error(`get-msg: 接口调用失败，${wording}。`)
            return resolve(data)
        }).catch(err => reject(err.message))
})

/*
{
    "data":{
        "group":false,
        "message":"咋滴了",
        "message_id":-296912625,
        "message_id_v2":"00000000000f112f0000551d",
        "message_seq":21789,
        "message_type":"private",
        "real_id":21789,
        "sender":{
            "nickname":"七两半",
            "user_id":987439
        },
        "time":1651198224
    },
    "retcode":0,
    "status":"ok"
}

{
    "data":null,
    "msg":"MSG_NOT_FOUND",
    "retcode":100,
    "status":"failed",
    "wording":"消息不存在"
}

*/
