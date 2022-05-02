import axios from 'axios'
import getInvalidParams from '../utils/get-invalid-params'
import { SendMsgResult } from './send-private-msg'

interface SendGroupMsgOpts {
    base_url: string
    group_id: number
    message: string
}

/**
 * 发送群聊消息
 * @param {string} base_url
 * @param {number} group_id 群号
 * @param {string} message 消息 CQ 码字符串
 * @returns {Promise<number>} message_id
 */
export default (opts: SendGroupMsgOpts): Promise<SendMsgResult> => new Promise((resolve, reject) => {
    const { base_url, group_id, message } = opts
    if (!base_url || !group_id || !message) throw new Error(`send-group-msg: 缺少必要的 ${getInvalidParams({
        base_url, group_id, message
    })} 参数。`)

    axios.get(`${base_url}/send_group_msg`, { params: { group_id, message } })
        .then(result => {
            if (!result) throw new Error('send-group-msg: 接口调用失败。')
            const { data, retcode, status, wording, msg } = result.data
            if (status != 'ok') throw new Error(`send-group-msg: 接口调用失败，${wording}。`)
            return resolve(data.message_id)
        }).catch(err => reject(err.message))
})