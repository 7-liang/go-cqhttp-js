interface DownloadFileOpts {
    base_url: string;
    url: string;
    thread_count: number;
    headers: string | string[];
}
export interface DownloadFileResult {
    file: string;
}
declare const _default: (opts: DownloadFileOpts) => Promise<DownloadFileResult>;
export default _default;
