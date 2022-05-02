interface GetVipInfoOpts {
    base_url: string;
    user_id: number;
}
export interface GetVipInfoResult {
    user_id: number;
    nickname: string;
    level: number;
    level_speed: number;
    vip_level: string;
    vip_growth_speed: number;
    vip_growth_total: number;
}
declare const _default: (opts: GetVipInfoOpts) => Promise<GetVipInfoResult>;
export default _default;
