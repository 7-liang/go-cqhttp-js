interface SetFriendAddRequestOpts {
    base_url: string;
    flag: string;
    approve?: boolean;
    remark?: string;
}
declare const _default: (opts: SetFriendAddRequestOpts) => Promise<unknown>;
export default _default;
