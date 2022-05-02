interface GetOnlineClientsOpts {
    base_url: string;
    no_cache?: boolean;
}
export interface GetOnlineClientsResult {
    clients: OnlineClientDevice[];
}
interface OnlineClientDevice {
    app_id: number;
    device_name: string;
    device_kind: string;
}
declare const _default: (opts: GetOnlineClientsOpts) => Promise<GetOnlineClientsResult>;
export default _default;
