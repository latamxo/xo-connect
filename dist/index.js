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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
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
exports.XOConnectProvider = exports.XOConnect = exports.Method = void 0;
var uuid_1 = require("uuid");
var Web3 = require('web3');
var Method;
(function (Method) {
    Method["available"] = "available";
    Method["connect"] = "connect";
    Method["personalSign"] = "personalSign";
    Method["transactionSign"] = "transactionSign";
    Method["typedDataSign"] = "typedDataSign";
})(Method = exports.Method || (exports.Method = {}));
var _XOConnect = /** @class */ (function () {
    function _XOConnect() {
        var _this = this;
        this.pendingRequests = new Map();
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.connectionId = (0, uuid_1.v4)();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 20)) return [3 /*break*/, 4];
                        if (!!window["XOConnect"]) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.delay(250)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!window["XOConnect"]) {
                            return [2 /*return*/, Promise.reject(new Error("No connection available"))];
                        }
                        window.addEventListener("message", this.messageHandler, false);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var timeout = setTimeout(function () {
                                    reject(new Error("No connection available"));
                                }, 10000);
                                _this.sendRequest({
                                    method: Method.connect,
                                    onSuccess: function (res) {
                                        clearTimeout(timeout);
                                        var client = res.data.client;
                                        var message = "xoConnect-".concat(res.id);
                                        var signature = client.signature;
                                        var web3 = new Web3("");
                                        var address = web3.eth.accounts.recover(message, signature);
                                        var eth = client.currencies.find(function (c) { return c.id == "ethereum.mainnet.native.eth"; });
                                        if (eth.address !== address) {
                                            throw new Error("Invalid signature");
                                        }
                                        _this.setClient(client);
                                        resolve({
                                            id: res.id,
                                            client: res.data.client
                                        });
                                    },
                                    onCancel: function () {
                                        reject(new Error("No connection available"));
                                    }
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
        if (!this.connectionId) {
            throw new Error("You are not connected");
        }
        var id = (0, uuid_1.v4)();
        var request = __assign({ id: id }, params);
        this.pendingRequests.set(id, request);
        window.postMessage(JSON.stringify({
            id: id,
            type: "send",
            method: request.method,
            data: request.data,
            currency: request.currency || "eth"
        }));
        return id;
    };
    _XOConnect.prototype.cancelRequest = function (id) {
        var request = this.pendingRequests.get(id);
        postMessage(JSON.stringify({
            id: id,
            type: "cancel",
            method: request.method
        }));
        this.pendingRequests["delete"](id);
    };
    _XOConnect.prototype.processResponse = function (response) {
        var request = this.pendingRequests.get(response.id);
        if (request) {
            if (response.type == "receive") {
                request.onSuccess(response);
            }
            if (response.type == "cancel") {
                request.onCancel();
            }
            this.pendingRequests["delete"](response.id);
        }
    };
    return _XOConnect;
}());
exports.XOConnect = new _XOConnect();
var xo_connect_provider_1 = require("./xo-connect-provider");
__createBinding(exports, xo_connect_provider_1, "XOConnectProvider");
