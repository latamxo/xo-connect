"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XOConnectProvider = void 0;
var _1 = require("./");
var rpc_client_1 = require("./rpc-client");
var debug_panel_1 = require("./debug-panel");
var XOConnectProvider = /** @class */ (function () {
    function XOConnectProvider(opts) {
        this.isXOConnect = true;
        this.listeners = new Map();
        this.rpcMap = null;
        this.rpc = null;
        this.chainIdHex = "0x1";
        this.debugPanel = null;
        if (opts === null || opts === void 0 ? void 0 : opts.defaultChainId) {
            var id = opts.defaultChainId.toLowerCase();
            if (!/^0x[0-9a-f]+$/i.test(id)) {
                throw new Error("XOConnectProvider: chainId must be hex (e.g., 0x1, 0x89)");
            }
            this.chainIdHex = id;
        }
        if (opts === null || opts === void 0 ? void 0 : opts.rpcs) {
            this.rpcMap = opts.rpcs;
            if (this.rpcMap[this.chainIdHex]) {
                this.rpc = new rpc_client_1.JsonRpcClient(this.rpcMap[this.chainIdHex]);
            }
        }
        if (opts === null || opts === void 0 ? void 0 : opts.debug) {
            this.debugPanel = new debug_panel_1.DebugPanel();
            this.debugPanel.info('init', {
                chainId: this.chainIdHex,
                rpcs: this.rpcMap ? Object.keys(this.rpcMap) : []
            });
            // Compartir el panel con el core XOConnect
            _1.XOConnect.debugPanel = this.debugPanel;
        }
    }
    XOConnectProvider.prototype.requireRpc = function (method) {
        if (!this.rpc) {
            throw new Error("XOConnectProvider: RPC not configured. The method \"".concat(method, "\" requires an RPC endpoint. ") +
                "Initialize the provider with rpcs option: new XOConnectProvider({ rpcs: { \"0x1\": \"https://...\" }, defaultChainId: \"0x1\" })");
        }
        return this.rpc;
    };
    // ---- Events
    XOConnectProvider.prototype.on = function (event, listener) {
        if (!this.listeners.has(event))
            this.listeners.set(event, new Set());
        this.listeners.get(event).add(listener);
    };
    XOConnectProvider.prototype.removeListener = function (event, listener) {
        var _a;
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.delete(listener);
    };
    XOConnectProvider.prototype.emit = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(function (l) { return l.apply(void 0, args); });
    };
    // ---- Client & accounts
    XOConnectProvider.prototype.getClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.client) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, _1.XOConnect.getClient()];
                    case 1:
                        _a.client = _b.sent();
                        return [4 /*yield*/, this.getAccounts()];
                    case 2:
                        accounts = _b.sent();
                        if (accounts.length)
                            this.emit("connect", { chainId: this.chainIdHex });
                        _b.label = 3;
                    case 3: return [2 /*return*/, this.client];
                }
            });
        });
    };
    // Filtrar currencies con chainId válido (hex como "0x1", "0x89", etc.)
    XOConnectProvider.prototype.filterValidCurrencies = function (currencies) {
        return (currencies || []).filter(function (c) {
            if (!c.chainId)
                return false;
            var raw = String(c.chainId).toLowerCase();
            var num = raw.startsWith("0x") ? parseInt(raw, 16) : parseInt(raw, 10);
            return !isNaN(num) && num > 0;
        });
    };
    XOConnectProvider.prototype.getAvailableCurrencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getClient()];
                    case 1:
                        client = _a.sent();
                        return [2 /*return*/, this.filterValidCurrencies(client.currencies)];
                }
            });
        });
    };
    XOConnectProvider.prototype.getAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, validCurrencies, cur;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getClient()];
                    case 1:
                        client = _a.sent();
                        validCurrencies = this.filterValidCurrencies(client.currencies);
                        cur = validCurrencies.find(function (c) { var _a, _b, _c; return ((_c = (_b = (_a = c.chainId) === null || _a === void 0 ? void 0 : _a.toLowerCase) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : "") === _this.chainIdHex; });
                        return [2 /*return*/, (cur === null || cur === void 0 ? void 0 : cur.address) ? [cur.address] : []];
                }
            });
        });
    };
    // ---- Helpers
    XOConnectProvider.prototype.withLatest = function (params, minLen) {
        if (minLen === void 0) { minLen = 2; }
        var p = Array.isArray(params) ? __spreadArray([], params, true) : [];
        // Ensure blockTag exists for methods like eth_call, eth_getCode
        if (p.length < minLen)
            p[minLen - 1] = "latest";
        return p;
    };
    // ---- Signing
    XOConnectProvider.prototype.personalSign = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var a, msg, encoder, bytes;
            return __generator(this, function (_a) {
                a = params !== null && params !== void 0 ? params : [];
                msg = typeof a[0] === "string" && !a[0].startsWith("0x") && a[1] ? a[1] : a[0];
                // Convertir mensaje a hex si no lo es (la wallet espera hex para toUtf8String)
                if (typeof msg === "string" && !msg.startsWith("0x")) {
                    encoder = new TextEncoder();
                    bytes = encoder.encode(msg);
                    msg = "0x" + Array.from(bytes).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _1.XOConnect.sendRequest({
                            method: _1.Method.personalSign,
                            data: msg,
                            onSuccess: function (res) { var _a, _b, _c; return resolve((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.signature) !== null && _b !== void 0 ? _b : (_c = res.data) === null || _c === void 0 ? void 0 : _c.txs); },
                            onCancel: function () { return reject(new Error("User rejected signature")); },
                        });
                    })];
            });
        });
    };
    // XOConnectProvider: inside signTransaction
    XOConnectProvider.prototype.signTransaction = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var client, validCurrencies, currencyId, from, valueForWallet, dataForWallet, txForSigning;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getClient()];
                    case 1:
                        client = _c.sent();
                        validCurrencies = this.filterValidCurrencies(client.currencies);
                        currencyId = (tx === null || tx === void 0 ? void 0 : tx.currency) ||
                            ((_a = validCurrencies.find(function (c) { var _a; return ((_a = c.chainId) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === _this.chainIdHex; })) === null || _a === void 0 ? void 0 : _a.id);
                        if (!currencyId)
                            throw new Error("Currency could not be resolved for transaction");
                        return [4 /*yield*/, this.getAccounts()];
                    case 2:
                        from = (_c.sent())[0];
                        valueForWallet = "0";
                        if (typeof tx.value === "object" && ((_b = tx.value) === null || _b === void 0 ? void 0 : _b.hex)) {
                            valueForWallet = BigInt(tx.value.hex).toString();
                        }
                        else if (typeof tx.value === "string" && tx.value.startsWith("0x")) {
                            valueForWallet = BigInt(tx.value).toString();
                        }
                        else if (tx.value) {
                            valueForWallet = String(tx.value);
                        }
                        dataForWallet = tx.data;
                        if (dataForWallet === "0" || dataForWallet === "") {
                            dataForWallet = undefined;
                        }
                        if (dataForWallet && typeof dataForWallet === "string" && !dataForWallet.startsWith("0x")) {
                            dataForWallet = "0x" + dataForWallet;
                        }
                        txForSigning = __assign(__assign({ from: from }, tx), { value: valueForWallet, data: dataForWallet });
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _1.XOConnect.sendRequest({
                                    method: _1.Method.transactionSign,
                                    data: txForSigning,
                                    currency: currencyId,
                                    onSuccess: function (res) { return __awaiter(_this, void 0, void 0, function () {
                                        var d, rpc, hash_1, hash, e_1;
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 3, , 4]);
                                                    d = (_a = res === null || res === void 0 ? void 0 : res.data) !== null && _a !== void 0 ? _a : {};
                                                    if (!(typeof d.signedTx === "string" && d.signedTx.startsWith("0x"))) return [3 /*break*/, 2];
                                                    rpc = this.requireRpc("eth_sendRawTransaction");
                                                    return [4 /*yield*/, rpc.call("eth_sendRawTransaction", [d.signedTx])];
                                                case 1:
                                                    hash_1 = _b.sent();
                                                    return [2 /*return*/, resolve(hash_1)];
                                                case 2:
                                                    hash = d.result;
                                                    if (typeof hash === "string" &&
                                                        hash.startsWith("0x") &&
                                                        hash.length === 66) {
                                                        return [2 /*return*/, resolve(hash)];
                                                    }
                                                    return [2 /*return*/, reject(new Error("Wallet returned neither signedTx nor transaction hash"))];
                                                case 3:
                                                    e_1 = _b.sent();
                                                    return [2 /*return*/, reject(e_1)];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                    onCancel: function () { return reject(new Error("User rejected transaction")); },
                                });
                            })];
                }
            });
        });
    };
    XOConnectProvider.prototype.signTypedData = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var typed;
            return __generator(this, function (_a) {
                typed = this.normalizeTypedParams(params);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _1.XOConnect.sendRequest({
                            method: _1.Method.typedDataSign,
                            data: typed, // solo el typed (string u objeto), como espera tu wallet hoy
                            onSuccess: function (res) { var _a; return resolve((_a = res.data) === null || _a === void 0 ? void 0 : _a.result); },
                            onCancel: function () { return reject(new Error("User rejected typed data signature")); },
                        });
                    })];
            });
        });
    };
    XOConnectProvider.prototype.normalizeTypedParams = function (params) {
        var isAddr = function (v) {
            return typeof v === "string" && /^0x[a-fA-F0-9]{40}$/.test(v);
        };
        var tryParse = function (v) {
            if (typeof v === "string") {
                try {
                    return JSON.parse(v);
                }
                catch (_a) {
                    /* noop */
                }
            }
            return v;
        };
        // MetaMask eth_signTypedData_v4 común: [address, jsonString]
        var payload;
        if (isAddr(params === null || params === void 0 ? void 0 : params[0])) {
            payload = params === null || params === void 0 ? void 0 : params[1];
        }
        else if (isAddr(params === null || params === void 0 ? void 0 : params[1])) {
            payload = params === null || params === void 0 ? void 0 : params[0];
        }
        else {
            payload = params === null || params === void 0 ? void 0 : params.find(function (x) { return x && (typeof x === "object" || typeof x === "string"); });
        }
        var obj = tryParse(payload);
        if (!obj || !obj.types || !obj.primaryType || !obj.message) {
            throw new Error("Invalid EIP-712 payload");
        }
        // Si tu wallet prefiere string, devolvelo stringificado; si acepta objeto, podés devolver obj directo.
        return typeof payload === "string" ? JSON.stringify(obj) : obj;
    };
    // ---- EIP-1193 request entrypoint
    XOConnectProvider.prototype.request = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result, err_1;
            var _c, _d, _e;
            var method = _b.method, params = _b.params;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        (_c = this.debugPanel) === null || _c === void 0 ? void 0 : _c.request(method, params);
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._handleRequest(method, params)];
                    case 2:
                        result = _f.sent();
                        (_d = this.debugPanel) === null || _d === void 0 ? void 0 : _d.response(method, result);
                        return [2 /*return*/, result];
                    case 3:
                        err_1 = _f.sent();
                        (_e = this.debugPanel) === null || _e === void 0 ? void 0 : _e.error(method, (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || err_1);
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    XOConnectProvider.prototype._handleRequest = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, next, accs, _b, _c, _d, _e, _f, _g, _h, _j;
            var _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _a = method;
                        switch (_a) {
                            case "eth_requestAccounts": return [3 /*break*/, 1];
                            case "eth_accounts": return [3 /*break*/, 1];
                            case "personal_sign": return [3 /*break*/, 2];
                            case "eth_sendTransaction": return [3 /*break*/, 3];
                            case "eth_signTypedData": return [3 /*break*/, 4];
                            case "eth_signTypedData_v4": return [3 /*break*/, 4];
                            case "eth_chainId": return [3 /*break*/, 5];
                            case "net_version": return [3 /*break*/, 6];
                            case "wallet_switchEthereumChain": return [3 /*break*/, 7];
                            case "eth_blockNumber": return [3 /*break*/, 9];
                            case "eth_gasPrice": return [3 /*break*/, 10];
                            case "eth_getBalance": return [3 /*break*/, 11];
                            case "eth_getTransactionCount": return [3 /*break*/, 15];
                            case "eth_getCode": return [3 /*break*/, 19];
                            case "eth_call": return [3 /*break*/, 20];
                            case "eth_estimateGas": return [3 /*break*/, 21];
                            case "eth_getLogs": return [3 /*break*/, 22];
                            case "eth_getBlockByNumber": return [3 /*break*/, 23];
                            case "eth_getBlockByHash": return [3 /*break*/, 23];
                            case "eth_getTransactionByHash": return [3 /*break*/, 23];
                            case "eth_getTransactionReceipt": return [3 /*break*/, 23];
                        }
                        return [3 /*break*/, 24];
                    case 1: return [2 /*return*/, this.getAccounts()];
                    case 2: return [2 /*return*/, this.personalSign(params !== null && params !== void 0 ? params : [])];
                    case 3: return [2 /*return*/, this.signTransaction(params === null || params === void 0 ? void 0 : params[0])];
                    case 4: return [2 /*return*/, this.signTypedData(params !== null && params !== void 0 ? params : [])];
                    case 5: return [2 /*return*/, this.chainIdHex];
                    case 6: return [2 /*return*/, parseInt(this.chainIdHex, 16).toString()];
                    case 7:
                        next = ((_l = (_k = params === null || params === void 0 ? void 0 : params[0]) === null || _k === void 0 ? void 0 : _k.chainId) !== null && _l !== void 0 ? _l : "").toLowerCase();
                        if (!next)
                            throw new Error("wallet_switchEthereumChain: chainId required");
                        this.chainIdHex = next;
                        // Update RPC if available for new chain
                        if (this.rpcMap && this.rpcMap[next]) {
                            this.rpc = new rpc_client_1.JsonRpcClient(this.rpcMap[next]);
                        }
                        else {
                            this.rpc = null;
                        }
                        this.emit("chainChanged", next);
                        return [4 /*yield*/, this.getAccounts()];
                    case 8:
                        accs = _m.sent();
                        if (accs)
                            this.emit("accountsChanged", accs);
                        return [2 /*return*/, null];
                    case 9: return [2 /*return*/, this.requireRpc(method).call("eth_blockNumber")];
                    case 10: return [2 /*return*/, this.requireRpc(method).call("eth_gasPrice")];
                    case 11:
                        _c = (_b = this.requireRpc(method)).call;
                        _d = ["eth_getBalance"];
                        if (!(params !== null && params !== void 0)) return [3 /*break*/, 12];
                        _e = params;
                        return [3 /*break*/, 14];
                    case 12: return [4 /*yield*/, this.getAccounts()];
                    case 13:
                        _e = [(_m.sent())[0], "latest"];
                        _m.label = 14;
                    case 14: return [2 /*return*/, _c.apply(_b, _d.concat([_e]))];
                    case 15:
                        _g = (_f = this.requireRpc(method)).call;
                        _h = ["eth_getTransactionCount"];
                        if (!(params !== null && params !== void 0)) return [3 /*break*/, 16];
                        _j = params;
                        return [3 /*break*/, 18];
                    case 16: return [4 /*yield*/, this.getAccounts()];
                    case 17:
                        _j = [(_m.sent())[0], "latest"];
                        _m.label = 18;
                    case 18: return [2 /*return*/, _g.apply(_f, _h.concat([_j]))];
                    case 19: return [2 /*return*/, this.requireRpc(method).call("eth_getCode", this.withLatest(params, 2))];
                    case 20: return [2 /*return*/, this.requireRpc(method).call("eth_call", this.withLatest(params, 2))];
                    case 21: return [2 /*return*/, this.requireRpc(method).call("eth_estimateGas", params !== null && params !== void 0 ? params : [{}])];
                    case 22: return [2 /*return*/, this.requireRpc(method).call("eth_getLogs", params !== null && params !== void 0 ? params : [])];
                    case 23: return [2 /*return*/, this.requireRpc(method).call(method, params !== null && params !== void 0 ? params : [])];
                    case 24: return [2 /*return*/, this.requireRpc(method).call(method, params !== null && params !== void 0 ? params : [])];
                }
            });
        });
    };
    return XOConnectProvider;
}());
exports.XOConnectProvider = XOConnectProvider;
