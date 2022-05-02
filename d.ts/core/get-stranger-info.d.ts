interface GetStrangerInfoOpts {
    base_url: string;
    user_id: number;
    no_cache?: boolean;
}
export interface GetStrangerInfoResult {
    user_id: number;
    nickname: string;
    sex: string;
    age: number;
    qid: string;
    level: number;
    login_days: number;
}
declare const _default: (opts: GetStrangerInfoOpts) => Promise<GetStrangerInfoResult>;
export default _default;
