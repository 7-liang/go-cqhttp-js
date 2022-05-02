interface GetGroupAtAllRemainOpts {
    base_url: string;
    group_id: number;
}
export interface GetGroupAtAllRemainResult {
    can_at_all: boolean;
    remain_at_all_count_for_group: number;
    remain_at_all_count_for_uin: number;
}
declare const _default: (opts: GetGroupAtAllRemainOpts) => Promise<GetGroupAtAllRemainResult>;
export default _default;
