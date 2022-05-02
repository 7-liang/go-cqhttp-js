interface GetVersionInfoOpts {
    base_url: string;
}
export interface GetVersionInfoResult {
    app_name: string;
    app_version: string;
    app_full_name: string;
    protocol_version: string;
    coolq_edition: string;
    coolq_directory: string;
    "go-cqhttp": boolean;
    plugin_version: string;
    plugin_build_number: number;
    plugin_build_configuration: string;
    runtime_version: string;
    runtime_os: string;
    version: string;
    protocol: number;
}
declare const _default: (opts: GetVersionInfoOpts) => Promise<GetVersionInfoResult>;
export default _default;
