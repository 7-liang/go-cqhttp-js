interface SendPrivateMsgOpts {
    base_url: string;
    user_id: number;
    group_id?: number;
    message: string;
}
export interface SendMsgResult {
    message_id: number;
}
declare const _default: (opts: SendPrivateMsgOpts) => Promise<SendMsgResult>;
export default _default;
