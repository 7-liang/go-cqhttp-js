interface UploadGroupFileOpts {
    base_url: string;
    group_id: number;
    file: string;
    name: string;
    folder: string;
}
declare const _default: (opts: UploadGroupFileOpts) => Promise<unknown>;
export default _default;
