import { SendMsgResult } from './send-private-msg';
interface SendGroupMsgOpts {
    base_url: string;
    group_id: number;
    message: string;
}
declare const _default: (opts: SendGroupMsgOpts) => Promise<SendMsgResult>;
export default _default;
