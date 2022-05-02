interface GetModelShowOpts {
    base_url: string;
    model: string;
}
export interface GetModelShowResult {
    variants: {
        model_show: string;
        need_pay: boolean;
    }[];
}
declare const _default: (opts: GetModelShowOpts) => Promise<GetModelShowResult>;
export default _default;
