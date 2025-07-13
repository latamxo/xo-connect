export declare enum Method {
    available = "available",
    connect = "connect",
    personalSign = "personalSign",
    transactionSign = "transactionSign",
    typedDataSign = "typedDataSign"
}
export interface Client {
    _id: string;
    alias: string;
    image: string;
    currencies: Array<{
        id: string;
        address: string;
        symbol?: string;
        icon?: string;
    }>;
}
export interface RequestParams {
    method: Method;
    data?: any;
    currency?: string;
    onSuccess: (response: Response) => void;
    onCancel: () => void;
}
export interface Request extends RequestParams {
    id: string;
}
export interface Response {
    id: string;
    type: string;
    data: any;
}
declare class _XOConnect {
    private connectionId;
    private pendingRequests;
    private client;
    setClient(client: Client): void;
    getClient(): Promise<Client | null>;
    delay(ms: number): Promise<void>;
    connect(): Promise<{
        id: string;
        client: Client;
    }>;
    disconnect(): void;
    sendRequest(params: RequestParams): string;
    cancelRequest(id: string): void;
    private processResponse;
    private messageHandler;
}
export declare const XOConnect: _XOConnect;
export { XOConnectProvider } from "./xo-connect-provider";
