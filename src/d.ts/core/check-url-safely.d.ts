interface CheckUrlSafelyOpts {
    base_url: string;
    url: string;
}
export interface CheckUrlSafelyResult {
    level: number;
}
declare const _default: (opts: CheckUrlSafelyOpts) => Promise<CheckUrlSafelyResult>;
export default _default;
