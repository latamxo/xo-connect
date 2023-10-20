declare module 'xo-connect' {
  export enum METHODS {
    available = "available",
    connect = "connect",
    personalSign = "personalSign",
    transactionSign = "transactionSign",
  }

  export enum TYPES {
    request = "request",
    response = "response",
  }

  export class XoConnect {
    static getInstance(): XoConnect;
    isAvailable(): Promise<boolean>;
    connect(): Promise<any>;
    getClient(): any;
    getChains(): any[];
    personalSign(chainID: string, address: string, message: string): Promise<any>;
    transactionSign(chainID: string, from: string, to: string, value: string, data: string): Promise<any>;
  }
}
