interface GetGroupMsgHistoryOpts {
    base_url: string;
    group_id: number;
    message_seq?: number;
}
export interface GetGroupMsgHistoryResult {
    messages: GroupMessageData[];
}
export interface GroupMessageData {
    anonymous: any;
    font: number;
    group_id: number;
    message: string;
    message_id: number;
    message_seq: number;
    message_type: string;
    post_type: string;
    self_id: number;
    sender: {
        age: number;
        area: string;
        card: string;
        level: string;
        nickname: string;
        role: string;
        sex: string;
        title: string;
        user_id: number;
    };
    sub_type: string;
    time: number;
    user_id: number;
}
declare const _default: (opts: GetGroupMsgHistoryOpts) => Promise<GetGroupMsgHistoryResult>;
export default _default;
