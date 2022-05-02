interface GetGroupFileUrlOpts {
    base_url: string;
    group_id: number;
    file_id: string;
    busid: number;
}
export interface GetGroupFileUrlResult {
    url: string;
}
declare const _default: (opts: GetGroupFileUrlOpts) => Promise<GetGroupFileUrlResult>;
export default _default;
