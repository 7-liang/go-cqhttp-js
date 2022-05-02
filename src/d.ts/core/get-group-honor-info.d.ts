export declare type GroupHonorType = 'talkative' | 'performer' | 'legend' | 'strong_newbie' | 'emotion' | 'all';
export interface GetGroupHonorInfoResult {
    group_id: number;
    current_talkative?: {
        user_id: number;
        nickname: string;
        avatar: string;
        day_count: number;
    };
    talkative_list?: GetGroupHonorInfoResult_Item[];
    performer_list?: GetGroupHonorInfoResult_Item[];
    legend_list?: GetGroupHonorInfoResult_Item[];
    strong_newbie_list?: GetGroupHonorInfoResult_Item[];
    emotion_list?: GetGroupHonorInfoResult_Item[];
}
interface GetGroupHonorInfoResult_Item {
    user_id: number;
    nickname: string;
    avatar: string;
    description: string;
}
interface GetGroupHonorInfoOpts {
    base_url: string;
    group_id: number;
    type: GroupHonorType;
}
declare const _default: (opts: GetGroupHonorInfoOpts) => Promise<GetGroupHonorInfoResult>;
export default _default;
