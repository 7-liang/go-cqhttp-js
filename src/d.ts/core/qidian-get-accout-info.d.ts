interface QidianGetAccountInfoOpts {
    base_url: string;
}
export interface QidianGetAccountInfoResult {
    master_id: number;
    ext_name: string;
    create_time: number;
}
declare const _default: (opts: QidianGetAccountInfoOpts) => Promise<QidianGetAccountInfoResult>;
export default _default;
