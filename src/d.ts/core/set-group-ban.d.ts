interface SetGroupBanOpts {
    base_url: string;
    group_id: number;
    user_id: number;
    duration?: number;
}
declare const _default: (opts: SetGroupBanOpts) => Promise<unknown>;
export default _default;
