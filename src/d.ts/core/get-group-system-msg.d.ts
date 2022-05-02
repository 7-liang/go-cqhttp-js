interface GetGroupSystemMsgOpts {
    base_url: string;
}
export interface GetGroupSystemMsgResult {
    invited_requests: GetGroupSystemMsgResult_InvitedRequest[] | null;
    join_requests: GetGroupSystemMsgResult_JoinRequest[] | null;
}
interface GetGroupSystemMsgResult_InvitedRequest {
    request_id: number;
    invitor_uin: number;
    invitor_nick: string;
    group_id: number;
    group_name: string;
    checked: boolean;
    actor: number;
}
interface GetGroupSystemMsgResult_JoinRequest {
    request_id: number;
    requester_uin: number;
    requester_nick: string;
    message: string;
    group_id: number;
    group_name: string;
    checked: boolean;
    actor: number;
}
declare const _default: (opts: GetGroupSystemMsgOpts) => Promise<GetGroupSystemMsgResult>;
export default _default;
