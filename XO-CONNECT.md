# XO-Connect

Librería para conectar aplicaciones web con wallets XO. Proporciona una interfaz EIP-1193 compatible con Ethereum.

## Instalación

```bash
npm install xo-connect
```

## Módulos Exportados

### XOConnect (Singleton)

Clase principal para gestionar la conexión con la wallet XO.

### XOConnectProvider

Provider compatible con EIP-1193 para interactuar con redes EVM.

---

## XOConnect

### Métodos

#### `connect()`

Establece conexión con la wallet XO.

```typescript
async connect(): Promise<{ id: string; client: Client }>
```

**Retorna:**
- `id`: Identificador único de la conexión
- `client`: Objeto con información del cliente conectado

**Ejemplo:**
```typescript
import { XOConnect } from 'xo-connect';

const { id, client } = await XOConnect.connect();
console.log(client.currencies); // Monedas disponibles
```

---

#### `disconnect()`

Desconecta la wallet y limpia los listeners.

```typescript
disconnect(): void
```

---

#### `getClient()`

Obtiene el cliente conectado. Si no hay conexión, la establece automáticamente.

```typescript
async getClient(): Promise<Client | null>
```

---

#### `sendRequest(params)`

Envía una solicitud a la wallet XO.

```typescript
sendRequest(params: RequestParams): string
```

**Parámetros:**
```typescript
interface RequestParams {
  method: Method;
  data?: any;
  currency?: string;
  onSuccess: (response: Response) => void;
  onCancel: () => void;
}
```

**Métodos disponibles:**
- `Method.connect` - Conectar wallet
- `Method.personalSign` - Firma de mensaje personal
- `Method.transactionSign` - Firma de transacción
- `Method.typedDataSign` - Firma de datos tipados (EIP-712)

---

#### `cancelRequest(id)`

Cancela una solicitud pendiente.

```typescript
cancelRequest(id: string): void
```

---

## XOConnectProvider

Provider EIP-1193 para usar con librerías como ethers.js, web3.js o wagmi.

### Constructor

```typescript
const provider = new XOConnectProvider({
  rpcs: {
    "0x1": "https://eth-mainnet.g.alchemy.com/v2/...",
    "0x89": "https://polygon-mainnet.g.alchemy.com/v2/..."
  },
  defaultChainId: "0x1"
});
```

**Parámetros:**
- `rpcs`: Objeto con RPCs por chainId (formato hex)
- `defaultChainId`: Chain por defecto (formato hex, ej: "0x1" para Ethereum Mainnet)

---

### Métodos Públicos

#### `request({ method, params })`

Método principal EIP-1193 para todas las operaciones.

```typescript
async request({ method, params }: { method: string; params?: any[] }): Promise<any>
```

---

#### `on(event, listener)`

Suscribe a eventos del provider.

```typescript
on(event: string, listener: (...args: any[]) => void): void
```

**Eventos disponibles:**
- `connect` - Emitido al conectar
- `chainChanged` - Emitido al cambiar de red
- `accountsChanged` - Emitido al cambiar cuentas

---

#### `removeListener(event, listener)`

Elimina un listener de eventos.

```typescript
removeListener(event: string, listener: (...args: any[]) => void): void
```

---

#### `getClient()`

Obtiene el cliente de la wallet.

```typescript
async getClient(): Promise<Client>
```

---

#### `getAvailableCurrencies()`

Obtiene las monedas disponibles en la wallet conectada.

```typescript
async getAvailableCurrencies(): Promise<Array<{ id: string; address: string; chainId: string }>>
```

---

### Métodos RPC Soportados

#### Cuentas y Firma

| Método | Descripción |
|--------|-------------|
| `eth_requestAccounts` | Solicita conexión y retorna cuentas |
| `eth_accounts` | Retorna cuentas conectadas |
| `personal_sign` | Firma un mensaje personal |
| `eth_sendTransaction` | Envía una transacción |
| `eth_signTypedData` | Firma datos tipados EIP-712 |
| `eth_signTypedData_v4` | Firma datos tipados EIP-712 v4 |

#### Gestión de Red

| Método | Descripción |
|--------|-------------|
| `eth_chainId` | Retorna el chainId actual (hex) |
| `net_version` | Retorna el network ID (decimal string) |
| `wallet_switchEthereumChain` | Cambia a otra red |

#### Lecturas (via RPC)

| Método | Descripción |
|--------|-------------|
| `eth_blockNumber` | Número de bloque actual |
| `eth_gasPrice` | Precio de gas actual |
| `eth_getBalance` | Balance de una cuenta |
| `eth_getTransactionCount` | Nonce de una cuenta |
| `eth_getCode` | Código de un contrato |
| `eth_call` | Ejecuta llamada de lectura |
| `eth_estimateGas` | Estima gas de una transacción |
| `eth_getLogs` | Obtiene logs/eventos |
| `eth_getBlockByNumber` | Información de bloque por número |
| `eth_getBlockByHash` | Información de bloque por hash |
| `eth_getTransactionByHash` | Información de transacción |
| `eth_getTransactionReceipt` | Recibo de transacción |

---

## Ejemplos de Uso

### Conexión Básica

```typescript
import { XOConnectProvider } from 'xo-connect';

const provider = new XOConnectProvider({
  rpcs: {
    "0x1": "https://eth-mainnet.rpc.url",
    "0x89": "https://polygon-mainnet.rpc.url"
  },
  defaultChainId: "0x1"
});

// Solicitar cuentas
const accounts = await provider.request({ method: 'eth_requestAccounts' });
console.log('Cuenta conectada:', accounts[0]);
```

### Firmar un Mensaje

```typescript
const message = "Hola, XO Connect!";
const signature = await provider.request({
  method: 'personal_sign',
  params: [message, accounts[0]]
});
```

### Enviar una Transacción

```typescript
const txHash = await provider.request({
  method: 'eth_sendTransaction',
  params: [{
    to: '0x...',
    value: '0x...',
    data: '0x...'
  }]
});
```

### Cambiar de Red

```typescript
await provider.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x89' }] // Polygon
});
```

### Escuchar Eventos

```typescript
provider.on('chainChanged', (chainId) => {
  console.log('Red cambiada a:', chainId);
});

provider.on('accountsChanged', (accounts) => {
  console.log('Cuentas actualizadas:', accounts);
});
```

### Uso con ethers.js

```typescript
import { ethers } from 'ethers';
import { XOConnectProvider } from 'xo-connect';

const xoProvider = new XOConnectProvider({
  rpcs: { "0x1": "https://..." },
  defaultChainId: "0x1"
});

const provider = new ethers.BrowserProvider(xoProvider);
const signer = await provider.getSigner();
```

---

## Interfaces

```typescript
interface Client {
  _id: string;
  alias: string;
  image: string;
  currencies: Array<{ id: string; address: string; chainId?: string }>;
}

interface Response {
  id: string;
  type: string;
  data: any;
}
```

---

## Redes Soportadas (ChainIds)

| Red | ChainId (Hex) | ChainId (Decimal) |
|-----|---------------|-------------------|
| Ethereum Mainnet | 0x1 | 1 |
| Polygon | 0x89 | 137 |
| Arbitrum | 0xa4b1 | 42161 |
| Optimism | 0xa | 10 |
| BSC | 0x38 | 56 |
| Avalanche | 0xa86a | 43114 |
