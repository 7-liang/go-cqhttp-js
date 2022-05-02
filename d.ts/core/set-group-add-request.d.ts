interface SetGroupAddRequestOpts {
    base_url: string;
    flag: string;
    sub_type: string;
    approve?: boolean;
    reason?: string;
}
declare const _default: (opts: SetGroupAddRequestOpts) => Promise<unknown>;
export default _default;
