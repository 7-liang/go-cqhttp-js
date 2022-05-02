interface SetGroupLeaveOpts {
    base_url: string;
    group_id: number;
    is_dismiss?: boolean;
}
declare const _default: (opts: SetGroupLeaveOpts) => Promise<unknown>;
export default _default;
