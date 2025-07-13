# XOConnect

`XOConnect` is an implementation of `ethers.providers.ExternalProvider` that allows dApps to interact with compatible wallets through **XOConnect protocol**, using WebView, iframe, or embedded contexts.

It is ideal for mobile or web apps that need to sign messages, send transactions, or interact with smart contracts using a non-standard wallet connection method.

---

## ✨ Features

- Compatible with `ethers.js` (`ethers.providers.Web3Provider`)
- Implements common JSON-RPC methods such as:
  - `eth_requestAccounts`
  - `eth_accounts`
  - `personal_sign`
  - `eth_sendTransaction`
  - `eth_signTypedData` / `eth_signTypedData_v4`
  - `eth_chainId`, `eth_blockNumber`, `eth_gasPrice`, etc.
- Provides access to the authenticated client and their available currencies

---

## 📦 Installation

```bash
yarn add xo-connect
# or
npm install xo-connect
```

---

## 🚀 Basic Usage

```ts
import { XOConnectProvider } from "xo-connect";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(new XOConnectProvider(), "any");

await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();

const address = await signer.getAddress();
const signature = await signer.signMessage("Hello from XOConnect");

const tx = await signer.sendTransaction({
  to: "0x123...",
  value: ethers.utils.parseEther("0.01"),
});
```

---

## 👤 Accessing the Client and Currencies

XOConnect also allows you to access the current authenticated client and their supported currencies:

```ts
import { XOConnect } from "xo-connect";

const client = await XOConnect.getClient();
console.log(client.alias); // e.g. "katemiller"
console.log(client.currencies); // Array of currencies with id, symbol, image, address, etc.
```

Each currency contains:

```ts
{
  id: "polygon.mainnet.native.matic",
  symbol: "MATIC",
  address: "0x...",
  image: "https://...",
  chainId: "0x89"
}
```

---

## 📄 License

MIT
