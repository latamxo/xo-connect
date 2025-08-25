type Listener = (...args: any[]) => void;
type RpcMap = Record<string, string>;
export declare class XOConnectProvider {
    isXOConnect: boolean;
    private listeners;
    private client;
    private rpcMap;
    private rpc;
    private chainIdHex;
    constructor(opts: {
        rpcs: RpcMap;
        defaultChainId: string;
    });
    on(event: string, listener: Listener): void;
    removeListener(event: string, listener: Listener): void;
    private emit;
    getClient(): Promise<any>;
    getAvailableCurrencies(): Promise<any>;
    private getAccounts;
    private withLatest;
    private personalSign;
    private signTransaction;
    private signTypedData;
    request({ method, params, }: {
        method: string;
        params?: any[];
    }): Promise<any>;
}
export {};
