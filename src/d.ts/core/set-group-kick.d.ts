interface SetGroupKickOpts {
    base_url: string;
    group_id: number;
    user_id: number;
    reject_add_request?: boolean;
}
declare const _default: (opts: SetGroupKickOpts) => Promise<unknown>;
export default _default;
