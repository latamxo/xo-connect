import { Method, XOConnect } from "./";
import { JsonRpcClient } from "./rpc-client";

type Listener = (...args: any[]) => void;

export class XOConnectProvider {
  isXOConnect = true;

  private listeners: Map<string, Set<Listener>> = new Map();
  private client: any;

  private rpc: JsonRpcClient;
  private chainIdHex: string;

  constructor(opts: { rpcUrl: string; chainId: string }) {
    this.rpc = new JsonRpcClient(opts.rpcUrl);
    this.chainIdHex = opts.chainId.toLowerCase();
  }

  on(event: string, listener: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
  }
  removeListener(event: string, listener: Listener) {
    this.listeners.get(event)?.delete(listener);
  }
  private emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((l) => l(...args));
  }

  async getClient() {
    if (!this.client) {
      this.client = await XOConnect.getClient();
      const accounts = await this.getAccounts();
      if (accounts.length) this.emit("connect", { chainId: this.chainIdHex });
    }
    return this.client;
  }

  async getAvailableCurrencies() {
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

  // 🔑 leave your signing paths UNCHANGED
  private async personalSign(params: string[]): Promise<string> {
    const message = params[0];
    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.personalSign,
        data: message,
        onSuccess: (res) => resolve(res.data.signature ?? res.data.txs), // keep backward compat
        onCancel: () => reject(new Error("User rejected signature")),
      });
    });
  }

  private async signTransaction(tx: any): Promise<string> {
    const client = await this.getClient();
    const currencyId =
      tx.currency ||
      client.currencies.find(
        (c: any) => c.chainId?.toLowerCase() === tx.chainId?.toLowerCase()
      )?.id;

    if (!currencyId)
      throw new Error("Currency could not be resolved for transaction");

    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.transactionSign,
        data: tx, 
        currency: currencyId,
        onSuccess: (res) => resolve(res.data.signedTx ?? res.data.hash),
        onCancel: () => reject(new Error("User rejected transaction")),
      });
    });
  }

  private async signTypedData(params: any[]): Promise<string> {
    const typed = params.find((x) => typeof x === "object");
    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.typedDataSign,
        data: typed,
        onSuccess: (res) => resolve(res.data.result),
        onCancel: () => reject(new Error("User rejected typed data signature")),
      });
    });
  }

  // ✅ EIP-1193 entrypoint with REAL reads, minimal edits elsewhere
  async request({
    method,
    params,
  }: {
    method: string;
    params?: any[];
  }): Promise<any> {
    switch (method) {
      // accounts & signing (unchanged)
      case "eth_requestAccounts":
      case "eth_accounts":
        return this.getAccounts();
      case "personal_sign":
        return this.personalSign(params ?? []);
      case "eth_sendTransaction":
        return this.signTransaction(params?.[0]);
      case "eth_signTypedData":
      case "eth_signTypedData_v4":
        return this.signTypedData(params ?? []);

      case "eth_chainId":
        return this.chainIdHex;
      case "net_version":
        return parseInt(this.chainIdHex, 16).toString();

      case "eth_blockNumber":
        return this.rpc.call("eth_blockNumber");
      case "eth_gasPrice":
        return this.rpc.call("eth_gasPrice");
      case "eth_getBalance":
        return this.rpc.call(
          "eth_getBalance",
          params ?? [(await this.getAccounts())[0], "latest"]
        );
      case "eth_getTransactionCount":
        return this.rpc.call(
          "eth_getTransactionCount",
          params ?? [(await this.getAccounts())[0], "latest"]
        );
      case "eth_getCode":
        return this.rpc.call("eth_getCode", params ?? []);
      case "eth_call":
        return this.rpc.call("eth_call", params ?? []);
      case "eth_estimateGas":
        return this.rpc.call("eth_estimateGas", params ?? [{}]);
      case "eth_getLogs":
        return this.rpc.call("eth_getLogs", params ?? []);
      case "eth_getBlockByNumber":
      case "eth_getBlockByHash":
      case "eth_getTransactionByHash":
      case "eth_getTransactionReceipt":
        return this.rpc.call(method, params ?? []);

      default:
        return this.rpc.call(method, params ?? []);
    }
  }
}
