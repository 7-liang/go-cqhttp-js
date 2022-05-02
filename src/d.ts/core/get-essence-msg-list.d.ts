interface GetEssenceMsgListOpts {
    base_url: string;
    group_id: number;
}
export interface GroupEssenceMsg {
    sender_id: number;
    sender_nick: string;
    sender_time: number;
    operator_id: number;
    operator_nick: string;
    operator_time: number;
    message_id: number;
}
declare const _default: (opts: GetEssenceMsgListOpts) => Promise<GroupEssenceMsg[]>;
export default _default;
