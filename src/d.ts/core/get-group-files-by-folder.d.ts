import { GroupFile, GroupFolder } from "./get-group-root-files";
interface GetGroupFilesByFolderOpts {
    base_url: string;
    group_id: number;
    folder_id: string;
}
export interface GetGroupFilesByFolderResult {
    files: GroupFile[];
    folders: GroupFolder[];
}
declare const _default: (opts: GetGroupFilesByFolderOpts) => Promise<GetGroupFilesByFolderResult>;
export default _default;
