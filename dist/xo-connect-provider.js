"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.__esModule = true;
exports.XOConnectProvider = void 0;
var _1 = require("./");
var XOConnectProvider = /** @class */ (function () {
    function XOConnectProvider() {
        this.isXOConnect = true;
        this.listeners = new Map();
    }
    XOConnectProvider.prototype.request = function (_a) {
        var method = _a.method, params = _a.params;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (method) {
                    case "eth_requestAccounts":
                    case "eth_accounts":
                        return [2 /*return*/, this.getAccounts()];
                    case "personal_sign":
                        return [2 /*return*/, this.personalSign(params)];
                    case "eth_chainId":
                        return [2 /*return*/, Promise.resolve("0x0")];
                    case "eth_sendTransaction":
                        return [2 /*return*/, this.signTransaction(params === null || params === void 0 ? void 0 : params[0])];
                    case "eth_blockNumber":
                        return [2 /*return*/, Promise.resolve("0x0")];
                    case "eth_gasPrice":
                        return [2 /*return*/, Promise.resolve("0x09184e72a000")]; // 100 Gwei
                    case "eth_getTransactionCount":
                        return [2 /*return*/, this.getAccounts().then(function () { return Promise.resolve("0x0"); })];
                    case "eth_estimateGas":
                        return [2 /*return*/, Promise.resolve("0x5208")];
                    case "eth_signTypedData":
                    case "eth_signTypedData_v4":
                        return [2 /*return*/, this.signTypedData(params)];
                    default:
                        return [2 /*return*/, Promise.reject(new Error("Unsupported method: ".concat(method)))];
                }
                return [2 /*return*/];
            });
        });
    };
    XOConnectProvider.prototype.on = function (event, listener) {
        var _a;
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.add(listener);
    };
    XOConnectProvider.prototype.removeListener = function (event, listener) {
        var _a;
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a["delete"](listener);
    };
    XOConnectProvider.prototype.getClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.client) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, _1.XOConnect.getClient()];
                    case 1:
                        _a.client = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.client];
                }
            });
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
                        return [2 /*return*/, client.currencies];
                }
            });
        });
    };
    XOConnectProvider.prototype.getAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, eth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getClient()];
                    case 1:
                        client = _a.sent();
                        eth = client.currencies.find(function (c) { return c.id === "ethereum.mainnet.native.eth"; });
                        return [2 /*return*/, (eth === null || eth === void 0 ? void 0 : eth.address) ? [eth.address] : []];
                }
            });
        });
    };
    XOConnectProvider.prototype.personalSign = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                message = params[0];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _1.XOConnect.sendRequest({
                            method: _1.Method.personalSign,
                            data: message,
                            onSuccess: function (res) { return resolve(res.data.txs); },
                            onCancel: function () { return reject(new Error("User rejected signature")); }
                        });
                    })];
            });
        });
    };
    XOConnectProvider.prototype.signTransaction = function (tx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var client, currencyId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getClient()];
                    case 1:
                        client = _b.sent();
                        currencyId = tx.currency ||
                            ((_a = client.currencies.find(function (c) { var _a; return ((_a = c.chainId) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === tx.chainId.toLowerCase(); })) === null || _a === void 0 ? void 0 : _a.id);
                        if (!currencyId) {
                            throw new Error("Currency could not be resolved for transaction");
                        }
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _1.XOConnect.sendRequest({
                                    method: _1.Method.transactionSign,
                                    data: tx,
                                    currency: currencyId,
                                    onSuccess: function (res) { return resolve(res.data.signedTx); },
                                    onCancel: function () { return reject(new Error("User rejected transaction")); }
                                });
                            })];
                }
            });
        });
    };
    XOConnectProvider.prototype.signTypedData = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var address, data;
            return __generator(this, function (_a) {
                address = params[0], data = params[1];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _1.XOConnect.sendRequest({
                            method: _1.Method.typedDataSign,
                            data: data,
                            onSuccess: function (res) { return resolve(res.data.result); },
                            onCancel: function () { return reject(new Error("User rejected typed data signature")); }
                        });
                    })];
            });
        });
    };
    return XOConnectProvider;
}());
exports.XOConnectProvider = XOConnectProvider;
