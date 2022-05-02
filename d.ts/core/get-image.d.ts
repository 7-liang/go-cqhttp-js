interface GetImageOpts {
    base_url: string;
    file: string;
}
export interface GetImageResult {
    file: string;
    filename: string;
    size: number;
    url: string;
}
declare const _default: (opts: GetImageOpts) => Promise<GetImageResult>;
export default _default;
