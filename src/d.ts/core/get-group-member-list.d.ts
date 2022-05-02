import { GetGroupMemberInfoResult } from './get-group-member-info';
interface GetGroupMemberListOpts {
    base_url: string;
    group_id: number;
}
declare const _default: (opts: GetGroupMemberListOpts) => Promise<GetGroupMemberInfoResult[]>;
export default _default;
