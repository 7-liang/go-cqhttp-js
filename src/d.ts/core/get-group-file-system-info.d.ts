interface GetGroupFileSystemInfoOpts {
    base_url: string;
    group_id: number;
}
export interface GetGroupFileSystemInfoResult {
    file_count: number;
    limit_count: number;
    used_space: number;
    total_space: number;
}
declare const _default: (opts: GetGroupFileSystemInfoOpts) => Promise<GetGroupFileSystemInfoResult>;
export default _default;
