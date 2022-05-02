import axios from "axios"
import getInvalidParams from "../utils/get-invalid-params"

interface SendPrivateMsgOpts {
    base_url: string
    user_id: number
    group_id?: number
    message: string
}

export interface SendMsgResult {
    message_id: number
}

/**
 * 发送私聊消息
 * @param {string} base_url
 * @param {number} user_id 对象 QQ 号
 * @param {number} group_id 如有群号，代表为群临时会话
 * @param {string} message 消息 CQ 码字符串
 * @returns {Promise<number>} message_id
 */
export default (opts: SendPrivateMsgOpts): Promise<SendMsgResult> => new Promise((resolve, reject) => {
    const { base_url, user_id, group_id, message } = opts
    if (!base_url || !user_id || !message) throw new Error(`send-private-msg: 缺少必要的 ${getInvalidParams({
        base_url, user_id, message
    })} 参数。`)

    let params: any = { user_id, message }
    if (group_id) params.group_id = group_id

    axios.get(`${base_url}/send_private_msg`, { params })
        .then(result => {
            if (!result) throw new Error('send-private-msg: 接口调用失败。')
            const { data, retcode, status, wording, msg } = result.data
            if (status != 'ok') throw new Error(`send-private-msg: 接口调用失败，${wording}。`)
            return resolve(data)
        })
        .catch(err => reject(err.message))
})

/*
{
    "data":{
        "message_id":1782578424
    },
    "retcode":0,
    "status":"ok"
}

{
    "data":null,
    "msg":"SEND_MSG_API_ERROR",
    "retcode":100,
    "status":"failed",
    "wording":"请参考 go-cqhttp 端输出"
}
*/


