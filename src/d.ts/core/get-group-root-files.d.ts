interface GetGroupRootFilesOpts {
    base_url: string;
    group_id: number;
}
export interface GetGroupRootFilesResult {
    files: GroupFile[];
    folders: GroupFolder[];
}
export interface GroupFile {
    group_id: number;
    file_id: string;
    file_name: string;
    busid: number;
    file_size: number;
    upload_time: number;
    dead_time: number;
    modify_time: number;
    download_times: number;
    uploader: number;
    uploader_name: string;
}
export interface GroupFolder {
    group_id: number;
    folder_id: string;
    folder_name: string;
    create_time: number;
    creator: number;
    creator_name: string;
    total_file_count: number;
}
declare const _default: (opts: GetGroupRootFilesOpts) => Promise<GetGroupRootFilesResult>;
export default _default;
