export declare class XOConnectProvider {
    isXOConnect: boolean;
    private listeners;
    private client;
    request({ method, params, }: {
        method: string;
        params?: any;
    }): Promise<any>;
    on(event: string, listener: (...args: any[]) => void): void;
    removeListener(event: string, listener: (...args: any[]) => void): void;
    getClient(): Promise<any>;
    getAvailableCurrencies(): Promise<{
        id: string;
        address: string;
        symbol: string;
        chainId: string;
        decimals: number;
        image?: string;
    }[]>;
    private getAccounts;
    private personalSign;
    private signTransaction;
    private signTypedData;
}
