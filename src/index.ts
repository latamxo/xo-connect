import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
//import Web3 from 'web3';


export enum Method {
    available = "available",
    connect = "connect",
    personalSign = "personalSign",
    transactionSign = "transactionSign",
}

export interface Client {
    _id: string;
    alias: string;
    profileImagePath: { square: string; thumbnail: string };
    currencies: Array<{ id: string; address: string }>;
}

interface RequestParams {
    method: Method;
    data?: any;
    currency?: 'ETH' | 'BTC' | 'MATIC'
    onSuccess: (response: Response) => void;
    onCancel: () => void;
}

export interface Request extends RequestParams {
    id: string;
}

export interface Response {
    id: string
    type: string
    data: any
}

class _XOConnect {

    private connectionId: string;
    private pendingRequests: Map<string, Request> = new Map();
    private client: Client;


    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(""), ms)).then(() => console.log("fired"));
    }

    async connect(): Promise<{ id: string, client: Client }> {
        this.connectionId = uuidv4();

        for (let i = 0; i < 20; i++) {
            if (!window["XOConnect"]) {
                await this.delay(250);
            }
        }

        if (!window["XOConnect"]) {
            return Promise.reject(new Error("No connection available"))
        }

        window.addEventListener("message", this.messageHandler, false);

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("No connection available"));
            }, 7000);

            this.sendRequest({
                method: Method.connect,
                onSuccess: (res: Response) => {
                    clearTimeout(timeout);

                    /*const client = res.data.client;
                    const message = `xoConnect-${res.id}`;
                    const signature = client.signature
                    const web3 = new Web3();
                    const address = web3.eth.accounts.recover(message, signature);

                    const eth = client.currencies.find(c => c.id == 'ETH');

                    if (eth.address !== address) {
                        throw new Error("Invalid signature");
                    }*/

                    resolve({
                        id: res.id,
                        client: res.data.client
                    });
                },
                onCancel: () => {
                    reject(new Error("No connection available"));
                }
            });
        });
    }

    disconnect(): void {
        window.removeEventListener("message", this.messageHandler);
        this.connectionId = "";
    }

    sendRequest(params: RequestParams): string {
        if (!this.connectionId) {
            throw new Error("You are not connected");
        }
        const id = uuidv4();
        const request: Request = { id, ...params };
        this.pendingRequests.set(id, request);
        window.postMessage(
            JSON.stringify({
                id,
                type: "send",
                method: request.method,
                data: request.data,
                currency: request.currency || 'eth'
            })
        );
        return id;
    }

    cancelRequest(id: string): void {
        const request = this.pendingRequests.get(id);
        postMessage(
            JSON.stringify({
                id,
                type: "cancel",
                method: request.method
            })
        );
        this.pendingRequests.delete(id);
    }

    private processResponse(response: Response): void {
        const request = this.pendingRequests.get(response.id);
        if (request) {
            if (response.type == 'receive') {
                request.onSuccess(response);
            }
            if (response.type == 'cancel') {
                request.onCancel()
            }
            this.pendingRequests.delete(response.id);
        }
    }

    private messageHandler = (event: MessageEvent) => {
        if (event.data?.length) {
            const res: Response = JSON.parse(event.data);
            if (res.type != 'send')
                this.processResponse(res);

        }
    };
}

export const XOConnect = new _XOConnect();
