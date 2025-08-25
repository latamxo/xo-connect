export class JsonRpcClient {
  constructor(private rpcUrl: string) {}

  async call<T = any>(method: string, params: any[] = []): Promise<T> {
    const res = await fetch(this.rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
    });
    const json = await res.json();
    if (json.error) {
      const { code, message, data } = json.error;
      const err: any = new Error(message || "RPC Error");
      err.code = code;
      err.reason = message;
      if (data) err.data = data;
      throw err;
    }
    return json.result as T;
  }
}
