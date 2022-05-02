interface GetStatusOpts {
    base_url: string;
}
export interface GetStatusResult {
    app_initialized: boolean | null;
    app_enabled: boolean | null;
    plugins_good: boolean | null;
    app_good: boolean | null;
    online: boolean | null;
    good: boolean | null;
    stat: null | {
        PacketReceived: number;
        PacketSent: number;
        PacketLost: number;
        MessageReceived: number;
        MessageSent: number;
        DisconnectTimes: number;
        LostTimes: number;
        LastMessageTime: number;
    };
}
declare const _default: (opts: GetStatusOpts) => Promise<GetStatusResult>;
export default _default;
