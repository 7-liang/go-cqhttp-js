interface GetFriendListOpts {
    base_url: string;
}
export interface GetFriendListResult {
    user_id: number;
    nickname: string;
    remark: string;
}
declare const _default: (opts: GetFriendListOpts) => Promise<GetFriendListResult[]>;
export default _default;
