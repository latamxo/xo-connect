export declare class JsonRpcClient {
    private rpcUrl;
    constructor(rpcUrl: string);
    call<T = any>(method: string, params?: any[]): Promise<T>;
}
