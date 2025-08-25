type Listener = (...args: any[]) => void;
export declare class XOConnectProvider {
    isXOConnect: boolean;
    private listeners;
    private client;
    private rpc;
    private chainIdHex;
    constructor(opts: {
        rpcUrl: string;
        chainId: string;
    });
    on(event: string, listener: Listener): void;
    removeListener(event: string, listener: Listener): void;
    private emit;
    getClient(): Promise<any>;
    getAvailableCurrencies(): Promise<any>;
    private getAccounts;
    private personalSign;
    private signTransaction;
    private signTypedData;
    request({ method, params, }: {
        method: string;
        params?: any[];
    }): Promise<any>;
}
export {};
