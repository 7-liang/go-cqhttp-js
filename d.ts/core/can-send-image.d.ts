interface CanSendImageOpts {
    base_url: string;
}
export interface CanSendImageResult {
    yes: boolean;
}
declare const _default: (opts: CanSendImageOpts) => Promise<CanSendImageResult>;
export default _default;
