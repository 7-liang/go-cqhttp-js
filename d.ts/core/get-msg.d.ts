interface GetMsgOpts {
    base_url: string;
    message_id: number;
}
export interface GetMsgResult {
    group: boolean;
    message: string;
    message_id: number;
    message_id_v2: string;
    message_seq: number;
    message_type: string;
    real_id: number;
    sender: {
        nickname: string;
        user_id: number;
    };
    time: number;
}
declare const _default: (opts: GetMsgOpts) => Promise<GetMsgResult>;
export default _default;
