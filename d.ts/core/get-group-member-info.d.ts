interface GetGroupMemberInfoOpts {
    base_url: string;
    group_id: number;
    user_id: number;
    no_cache?: boolean;
}
export interface GetGroupMemberInfoResult {
    group_id: number;
    user_id: number;
    nickname: string;
    card: string;
    age: number;
    area: string;
    join_time: number;
    last_sent_time: number;
    level: string;
    role: string;
    unfriendly: boolean;
    title: string;
    title_expire_time: number;
    card_changeable: boolean;
    shut_up_timestamp: number;
}
declare const _default: (opts: GetGroupMemberInfoOpts) => Promise<GetGroupMemberInfoResult>;
export default _default;
