interface GetGroupInfoOpts {
    base_url: string;
    group_id: number;
    no_cache?: boolean;
}
export interface GetGroupInfoResult {
    group_id: number;
    group_nmae: string;
    group_memo: string;
    group_create_time: number;
    group_level: number;
    member_count: number;
    max_member_count: number;
}
declare const _default: (opts: GetGroupInfoOpts) => Promise<GetGroupInfoResult>;
export default _default;
