import { GetGroupInfoResult } from './get-group-info';
interface GetGroupListOpts {
    base_url: string;
}
declare const _default: (opts: GetGroupListOpts) => Promise<GetGroupInfoResult[]>;
export default _default;
