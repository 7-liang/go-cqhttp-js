interface SetGroupPortraitOpts {
    base_url: string;
    group_id: number;
    file: string;
    cache?: number;
}
declare const _default: (opts: SetGroupPortraitOpts) => Promise<unknown>;
export default _default;
