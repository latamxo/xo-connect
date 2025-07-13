import { Method, XOConnect } from "./";

export class XOConnectProvider {
  isXOConnect = true;
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private client: any;

  async request({
    method,
    params,
  }: {
    method: string;
    params?: any;
  }): Promise<any> {
    switch (method) {
      case "eth_requestAccounts":
      case "eth_accounts":
        return this.getAccounts();

      case "personal_sign":
        return this.personalSign(params);

      case "eth_chainId":
        return Promise.resolve("0x0");

      case "eth_sendTransaction":
        return this.signTransaction(params?.[0]);

      case "eth_blockNumber":
        return Promise.resolve("0x0");

      case "eth_gasPrice":
        return Promise.resolve("0x09184e72a000"); // 100 Gwei

      case "eth_getTransactionCount":
        return this.getAccounts().then(() => Promise.resolve("0x0"));

      case "eth_estimateGas":
        return Promise.resolve("0x5208");

      case "eth_signTypedData":
      case "eth_signTypedData_v4":
        return this.signTypedData(params);

      default:
        return Promise.reject(new Error(`Unsupported method: ${method}`));
    }
  }

  on(event: string, listener: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(listener);
  }

  removeListener(event: string, listener: (...args: any[]) => void) {
    this.listeners.get(event)?.delete(listener);
  }

  async getClient() {
    if (!this.client) {
      this.client = await XOConnect.getClient();
    }
    return this.client;
  }

  async getAvailableCurrencies(): Promise<
    {
      id: string;
      address: string;
      symbol: string;
      chainId: string;
      decimals: number;
      image?: string;
    }[]
  > {
    const client = await this.getClient();
    return client.currencies;
  }

  private async getAccounts(): Promise<string[]> {
    const client = await this.getClient();
    const eth = client.currencies.find(
      (c: any) => c.id === "ethereum.mainnet.native.eth"
    );
    return eth?.address ? [eth.address] : [];
  }

  private async personalSign(params: string[]): Promise<string> {
    const message = params[0];
    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.personalSign,
        data: message,
        onSuccess: (res) => resolve(res.data.txs),
        onCancel: () => reject(new Error("User rejected signature")),
      });
    });
  }

  private async signTransaction(tx: any): Promise<string> {
    const client = await this.getClient();

    const currencyId =
      tx.currency ||
      client.currencies.find(
        (c: any) => c.chainId?.toLowerCase() === tx.chainId.toLowerCase()
      )?.id;

    if (!currencyId) {
      throw new Error("Currency could not be resolved for transaction");
    }

    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.transactionSign,
        data: tx,
        currency: currencyId,
        onSuccess: (res) => resolve(res.data.signedTx),
        onCancel: () => reject(new Error("User rejected transaction")),
      });
    });
  }

  private async signTypedData(params: any[]): Promise<string> {
    const [address, data] = params;

    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.typedDataSign,
        data,
        onSuccess: (res) => resolve(res.data.result),
        onCancel: () => reject(new Error("User rejected typed data signature")),
      });
    });
  }
}
