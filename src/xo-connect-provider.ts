import { Method, XOConnect } from "./";
import { JsonRpcClient } from "./rpc-client";

type Listener = (...args: any[]) => void;
type RpcMap = Record<string /* hex chainId like "0x1" */, string /* rpc url */>;

export class XOConnectProvider {
  isXOConnect = true;

  private listeners: Map<string, Set<Listener>> = new Map();
  private client: any;

  private rpcMap: RpcMap;
  private rpc: JsonRpcClient;
  private chainIdHex: string;

  constructor(opts: { rpcs: RpcMap; defaultChainId: string }) {
    if (!opts?.rpcs) throw new Error("XOConnectProvider: rpcs is required");
    if (!opts?.defaultChainId)
      throw new Error("XOConnectProvider: defaultChainId is required");
    const id = opts.defaultChainId.toLowerCase();
    if (!/^0x[0-9a-f]+$/i.test(id))
      throw new Error(
        "XOConnectProvider: chainId must be hex (e.g., 0x1, 0x89)"
      );

    this.rpcMap = opts.rpcs;
    if (!this.rpcMap[id])
      throw new Error(`XOConnectProvider: no RPC configured for ${id}`);

    this.chainIdHex = id;
    this.rpc = new JsonRpcClient(this.rpcMap[this.chainIdHex]);
  }

  // ---- Events
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

  // ---- Client & accounts
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
    // currencies[*].chainId should be hex ("0x1", "0x89", ...)
    const cur = client.currencies?.find(
      (c: any) => (c.chainId?.toLowerCase?.() ?? "") === this.chainIdHex
    );
    return cur?.address ? [cur.address] : [];
  }

  // ---- Helpers
  private withLatest(params?: any[], minLen = 2): any[] {
    const p = Array.isArray(params) ? [...params] : [];
    // Ensure blockTag exists for methods like eth_call, eth_getCode
    if (p.length < minLen) p[minLen - 1] = "latest";
    return p;
  }

  // ---- Signing (unchanged)
  private async personalSign(params: any[]): Promise<string> {
    const a = params ?? [];
    // Handle both [msg, addr] and [addr, msg]
    const msg =
      typeof a[0] === "string" && !a[0].startsWith("0x") && a[1] ? a[1] : a[0];
    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.personalSign,
        data: msg,
        onSuccess: (res) => resolve(res.data?.signature ?? res.data?.txs),
        onCancel: () => reject(new Error("User rejected signature")),
      });
    });
  }

  private async signTransaction(tx: any): Promise<string> {
    const client = await this.getClient();
    const currencyId =
      tx?.currency ||
      client.currencies?.find(
        (c: any) => c.chainId?.toLowerCase() === this.chainIdHex
      )?.id;

    if (!currencyId)
      throw new Error("Currency could not be resolved for transaction");

    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.transactionSign,
        data: tx, // your wallet builds/signs/broadcasts as before
        currency: currencyId,
        onSuccess: (res) => resolve(res.data?.signedTx ?? res.data?.hash),
        onCancel: () => reject(new Error("User rejected transaction")),
      });
    });
  }

  private async signTypedData(params: any[]): Promise<string> {
    const typed = params?.find((x) => typeof x === "object");
    return new Promise((resolve, reject) => {
      XOConnect.sendRequest({
        method: Method.typedDataSign,
        data: typed,
        onSuccess: (res) => resolve(res.data?.result),
        onCancel: () => reject(new Error("User rejected typed data signature")),
      });
    });
  }

  // ---- EIP-1193 request entrypoint
  async request({
    method,
    params,
  }: {
    method: string;
    params?: any[];
  }): Promise<any> {
    switch (method) {
      // accounts & signing
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

      // chain mgmt (MetaMask/WalletConnect-style)
      case "eth_chainId":
        return this.chainIdHex;
      case "net_version":
        return parseInt(this.chainIdHex, 16).toString();
      case "wallet_switchEthereumChain": {
        const next = (params?.[0]?.chainId ?? "").toLowerCase();
        if (!next)
          throw new Error("wallet_switchEthereumChain: chainId required");
        if (!this.rpcMap[next])
          throw new Error(`No RPC configured for chain ${next}`);
        this.chainIdHex = next;
        this.rpc = new JsonRpcClient(this.rpcMap[next]);
        this.emit("chainChanged", next);
        // Optional: also emit accountsChanged if your account is chain-specific
        const accs = await this.getAccounts();
        if (accs) this.emit("accountsChanged", accs);
        return null;
      }

      // reads (proxied to current rpc)
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
        return this.rpc.call("eth_getCode", this.withLatest(params, 2));
      case "eth_call":
        return this.rpc.call("eth_call", this.withLatest(params, 2));
      case "eth_estimateGas":
        return this.rpc.call("eth_estimateGas", params ?? [{}]);
      case "eth_getLogs":
        return this.rpc.call("eth_getLogs", params ?? []);
      case "eth_getBlockByNumber":
      case "eth_getBlockByHash":
      case "eth_getTransactionByHash":
      case "eth_getTransactionReceipt":
        return this.rpc.call(method, params ?? []);

      // fallback: proxy unknowns
      default:
        return this.rpc.call(method, params ?? []);
    }
  }
}
