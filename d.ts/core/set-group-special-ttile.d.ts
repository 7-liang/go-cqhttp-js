interface SetGroupSpecialTitleOpts {
    base_url: string;
    group_id: number;
    user_id: number;
    special_title?: string;
    duration?: number;
}
declare const _default: (opts: SetGroupSpecialTitleOpts) => Promise<unknown>;
export default _default;
