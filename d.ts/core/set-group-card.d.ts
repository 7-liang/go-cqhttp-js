interface SetGroupCardOpts {
    base_url: string;
    group_id: number;
    user_id: number;
    card: string;
}
declare const _default: (opts: SetGroupCardOpts) => Promise<unknown>;
export default _default;
