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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XOConnectProvider = exports.XOConnect = exports.Method = void 0;
var uuid_1 = require("uuid");
var ethers_1 = require("ethers");
var Method;
(function (Method) {
    Method["available"] = "available";
    Method["connect"] = "connect";
    Method["personalSign"] = "personalSign";
    Method["transactionSign"] = "transactionSign";
    Method["typedDataSign"] = "typedDataSign";
})(Method || (exports.Method = Method = {}));
var _XOConnect = /** @class */ (function () {
    function _XOConnect() {
        var _this = this;
        this.pendingRequests = new Map();
        this.debugPanel = null;
        this.messageHandler = function (event) {
            var _a;
            if ((_a = event.data) === null || _a === void 0 ? void 0 : _a.length) {
                var res = JSON.parse(event.data);
                if (res.type != "send")
                    _this.processResponse(res);
            }
        };
    }
    _XOConnect.prototype.setClient = function (client) {
        this.client = client;
    };
    _XOConnect.prototype.getClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.client) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        client = (_a.sent()).client;
                        this.client = client;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.client];
                }
            });
        });
    };
    _XOConnect.prototype.delay = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(""); }, ms); }).then(function () { })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    _XOConnect.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.connectionId = (0, uuid_1.v4)();
                        (_a = this.debugPanel) === null || _a === void 0 ? void 0 : _a.info('connect', 'Buscando wallet XO...');
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < 20)) return [3 /*break*/, 4];
                        if (!!window["XOConnect"]) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.delay(250)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!window["XOConnect"]) {
                            (_b = this.debugPanel) === null || _b === void 0 ? void 0 : _b.error('connect', 'Wallet XO no encontrada');
                            return [2 /*return*/, Promise.reject(new Error("No connection available"))];
                        }
                        (_c = this.debugPanel) === null || _c === void 0 ? void 0 : _c.info('connect', 'Wallet XO detectada');
                        window.addEventListener("message", this.messageHandler, false);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var timeout = setTimeout(function () {
                                    reject(new Error("No connection available"));
                                }, 10000);
                                _this.sendRequest({
                                    method: Method.connect,
                                    onSuccess: function (res) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                        clearTimeout(timeout);
                                        (_a = _this.debugPanel) === null || _a === void 0 ? void 0 : _a.info('connect', 'Respuesta recibida');
                                        try {
                                            var client = res.data.client;
                                            (_b = _this.debugPanel) === null || _b === void 0 ? void 0 : _b.info('connect', "Client: ".concat((client === null || client === void 0 ? void 0 : client.alias) || 'sin alias'));
                                            var message = "xoConnect-".concat(res.id);
                                            var signature = client.signature;
                                            (_c = _this.debugPanel) === null || _c === void 0 ? void 0 : _c.info('connect', "Signature: ".concat(signature === null || signature === void 0 ? void 0 : signature.slice(0, 20), "..."));
                                            var address = ethers_1.ethers.utils.verifyMessage(message, signature);
                                            (_d = _this.debugPanel) === null || _d === void 0 ? void 0 : _d.info('connect', "Recovered address: ".concat(address));
                                            // Log todas las currencies recibidas
                                            (_e = _this.debugPanel) === null || _e === void 0 ? void 0 : _e.info('connect', "Currencies recibidas: ".concat(((_f = client.currencies) === null || _f === void 0 ? void 0 : _f.length) || 0));
                                            (_g = client.currencies) === null || _g === void 0 ? void 0 : _g.forEach(function (c, i) {
                                                var _a;
                                                (_a = _this.debugPanel) === null || _a === void 0 ? void 0 : _a.info('currency', "".concat(i, ": ").concat(c.id, " chainId=").concat(c.chainId));
                                            });
                                            var eth = client.currencies.find(function (c) { return c.id == "ethereum.mainnet.native.eth"; });
                                            (_h = _this.debugPanel) === null || _h === void 0 ? void 0 : _h.info('connect', "ETH address: ".concat(eth === null || eth === void 0 ? void 0 : eth.address));
                                            if (eth.address !== address) {
                                                (_j = _this.debugPanel) === null || _j === void 0 ? void 0 : _j.error('connect', "Address mismatch: ".concat(eth.address, " vs ").concat(address));
                                                throw new Error("Invalid signature");
                                            }
                                            _this.setClient(client);
                                            (_k = _this.debugPanel) === null || _k === void 0 ? void 0 : _k.response('connect', { address: eth.address, alias: client.alias });
                                            resolve({
                                                id: res.id,
                                                client: res.data.client,
                                            });
                                        }
                                        catch (e) {
                                            (_l = _this.debugPanel) === null || _l === void 0 ? void 0 : _l.error('connect', "Error: ".concat(e.message));
                                            reject(e);
                                        }
                                    },
                                    onCancel: function () {
                                        var _a;
                                        (_a = _this.debugPanel) === null || _a === void 0 ? void 0 : _a.error('connect', 'Conexión cancelada');
                                        reject(new Error("No connection available"));
                                    },
                                });
                            })];
                }
            });
        });
    };
    _XOConnect.prototype.disconnect = function () {
        window.removeEventListener("message", this.messageHandler);
        this.connectionId = "";
    };
    _XOConnect.prototype.sendRequest = function (params) {
        var _a, _b;
        if (!this.connectionId) {
            (_a = this.debugPanel) === null || _a === void 0 ? void 0 : _a.error('sendRequest', 'No conectado');
            throw new Error("You are not connected");
        }
        var id = (0, uuid_1.v4)();
        var request = __assign({ id: id }, params);
        this.pendingRequests.set(id, request);
        (_b = this.debugPanel) === null || _b === void 0 ? void 0 : _b.request(params.method, { currency: params.currency, data: params.data });
        window.postMessage(JSON.stringify({
            id: id,
            type: "send",
            method: request.method,
            data: request.data,
            currency: request.currency || "eth",
        }));
        return id;
    };
    _XOConnect.prototype.cancelRequest = function (id) {
        var request = this.pendingRequests.get(id);
        postMessage(JSON.stringify({
            id: id,
            type: "cancel",
            method: request.method,
        }));
        this.pendingRequests.delete(id);
    };
    _XOConnect.prototype.processResponse = function (response) {
        var _a, _b;
        var request = this.pendingRequests.get(response.id);
        if (request) {
            if (response.type == "receive") {
                (_a = this.debugPanel) === null || _a === void 0 ? void 0 : _a.response(request.method, response.data);
                request.onSuccess(response);
            }
            if (response.type == "cancel") {
                (_b = this.debugPanel) === null || _b === void 0 ? void 0 : _b.error(request.method, 'Cancelado por usuario');
                request.onCancel();
            }
            this.pendingRequests.delete(response.id);
        }
    };
    return _XOConnect;
}());
exports.XOConnect = new _XOConnect();
var xo_connect_provider_1 = require("./xo-connect-provider");
Object.defineProperty(exports, "XOConnectProvider", { enumerable: true, get: function () { return xo_connect_provider_1.XOConnectProvider; } });
