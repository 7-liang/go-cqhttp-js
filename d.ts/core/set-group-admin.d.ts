interface SetGroupAdminOpts {
    base_url: string;
    group_id: number;
    user_id: number;
    enable?: boolean;
}
declare const _default: (opts: SetGroupAdminOpts) => Promise<unknown>;
export default _default;
