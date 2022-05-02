interface GetLoginInfoOpts {
    base_url: string;
}
export interface GetLoginInfoResult {
    user_id: number;
    nickname: string;
}
declare const _default: (opts: GetLoginInfoOpts) => Promise<GetLoginInfoResult>;
export default _default;
