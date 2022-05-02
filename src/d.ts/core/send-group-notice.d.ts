interface SendGroupNoticeOpts {
    base_url: string;
    group_id: number;
    content: string;
    image?: string;
}
declare const _default: (opts: SendGroupNoticeOpts) => Promise<unknown>;
export default _default;
