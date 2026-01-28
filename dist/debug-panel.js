"use strict";
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
exports.DebugPanel = void 0;
var DebugPanel = /** @class */ (function () {
    function DebugPanel() {
        var _this = this;
        this.container = null;
        this.logList = null;
        this.isCollapsed = false;
        this.logs = [];
        this.errorCount = 0;
        if (typeof window !== 'undefined') {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function () { return _this.init(); });
            }
            else {
                this.init();
            }
        }
    }
    DebugPanel.prototype.init = function () {
        try {
            this.createPanel();
            this.renderPendingLogs();
            this.captureGlobalErrors();
            this.captureConsoleLogs();
            this.logInitialState();
        }
        catch (e) {
            // Si falla la creación del panel, intentar mostrar error básico
            this.showFallbackError(e);
        }
    };
    DebugPanel.prototype.renderPendingLogs = function () {
        // Renderizar logs que se acumularon antes de que el panel estuviera listo
        var pendingLogs = __spreadArray([], this.logs, true);
        this.logs = [];
        for (var _i = 0, pendingLogs_1 = pendingLogs; _i < pendingLogs_1.length; _i++) {
            var entry = pendingLogs_1[_i];
            this.log(entry.type, entry.method, entry.data);
        }
    };
    DebugPanel.prototype.logInitialState = function () {
        var _this = this;
        this.log('info', 'Debug Panel', 'Iniciado');
        this.log('info', 'URL', window.location.href);
        this.log('info', 'XOConnect', window.XOConnect ? 'Detectado ✓' : 'No detectado ✗');
        this.log('info', 'ReactNativeWebView', window.ReactNativeWebView ? 'Detectado ✓' : 'No detectado ✗');
        // Monitorear si XOConnect aparece después
        if (!window.XOConnect) {
            var checks_1 = 0;
            var interval_1 = setInterval(function () {
                checks_1++;
                if (window.XOConnect) {
                    _this.log('info', 'XOConnect', "Detectado despu\u00E9s de ".concat(checks_1 * 500, "ms \u2713"));
                    clearInterval(interval_1);
                }
                else if (checks_1 >= 20) {
                    _this.log('error', 'XOConnect', 'No detectado después de 10s');
                    clearInterval(interval_1);
                }
            }, 500);
        }
    };
    DebugPanel.prototype.showFallbackError = function (e) {
        var _a;
        // Si el panel no se puede crear, mostrar un div simple de error
        var div = document.createElement('div');
        div.style.cssText = 'position:fixed;bottom:10px;right:10px;background:red;color:white;padding:10px;z-index:999999;font-size:12px;';
        div.textContent = "XO Debug Error: ".concat((e === null || e === void 0 ? void 0 : e.message) || e);
        (_a = document.body) === null || _a === void 0 ? void 0 : _a.appendChild(div);
    };
    DebugPanel.prototype.captureGlobalErrors = function () {
        var _this = this;
        window.onerror = function (message, source, lineno, colno, error) {
            _this.log('error', 'JS Error', "".concat(message, " (").concat(source, ":").concat(lineno, ")"));
            return false;
        };
        window.onunhandledrejection = function (event) {
            var _a;
            _this.log('error', 'Promise Error', ((_a = event.reason) === null || _a === void 0 ? void 0 : _a.message) || event.reason);
        };
    };
    DebugPanel.prototype.captureConsoleLogs = function () {
        var _this = this;
        var originalLog = console.log;
        var originalError = console.error;
        var originalWarn = console.warn;
        console.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.log('info', 'console.log', args.map(function (a) { return typeof a === 'object' ? JSON.stringify(a) : a; }).join(' '));
            originalLog.apply(console, args);
        };
        console.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.log('error', 'console.error', args.map(function (a) { return typeof a === 'object' ? JSON.stringify(a) : a; }).join(' '));
            originalError.apply(console, args);
        };
        console.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.log('info', 'console.warn', args.map(function (a) { return typeof a === 'object' ? JSON.stringify(a) : a; }).join(' '));
            originalWarn.apply(console, args);
        };
    };
    DebugPanel.prototype.updateBadge = function () {
        var _a;
        var badge = (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelector('#xo-debug-badge');
        if (badge) {
            if (this.errorCount > 0 && this.isCollapsed) {
                badge.textContent = this.errorCount > 99 ? '99+' : String(this.errorCount);
                badge.style.display = 'flex';
            }
            else {
                badge.style.display = 'none';
            }
        }
    };
    DebugPanel.prototype.createPanel = function () {
        var _this = this;
        var _a, _b;
        // Container principal
        this.container = document.createElement('div');
        this.container.id = 'xo-debug-panel';
        this.container.innerHTML = "\n      <style>\n        #xo-debug-panel {\n          position: fixed;\n          bottom: 16px;\n          right: 16px;\n          width: 380px;\n          max-height: 320px;\n          background: #1a1a1a;\n          border: 1px solid #333;\n          border-radius: 12px;\n          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;\n          font-size: 12px;\n          color: #e0e0e0;\n          z-index: 999999;\n          box-shadow: 0 4px 24px rgba(0,0,0,0.4);\n          display: flex;\n          flex-direction: column;\n          transition: all 0.2s ease;\n        }\n        #xo-debug-panel.collapsed {\n          width: auto;\n          height: 40px;\n          max-height: 40px;\n          border-radius: 20px;\n          overflow: hidden;\n        }\n        #xo-debug-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 10px 12px;\n          background: #222;\n          border-bottom: 1px solid #333;\n          border-radius: 12px 12px 0 0;\n          cursor: pointer;\n          user-select: none;\n        }\n        #xo-debug-panel.collapsed #xo-debug-header {\n          border-radius: 20px;\n          border-bottom: none;\n          padding: 0 12px;\n          height: 40px;\n          justify-content: center;\n          background: #1a1a1a;\n          gap: 10px;\n        }\n        #xo-debug-title {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-weight: 600;\n          color: #fff;\n        }\n        #xo-debug-panel.collapsed #xo-debug-title {\n          display: flex;\n          font-size: 11px;\n        }\n        #xo-debug-panel.collapsed #xo-debug-title::before {\n          display: none;\n        }\n        #xo-debug-title::before {\n          content: '';\n          width: 8px;\n          height: 8px;\n          background: #fff;\n          border-radius: 50%;\n        }\n        #xo-debug-actions {\n          display: flex;\n        }\n        #xo-debug-panel.collapsed #xo-debug-actions {\n          position: relative;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n        .xo-debug-btn {\n          background: #333;\n          border: 1px solid #444;\n          border-radius: 6px;\n          color: #fff;\n          cursor: pointer;\n          padding: 6px 14px;\n          font-size: 18px;\n          font-weight: bold;\n          line-height: 1;\n          transition: background 0.2s;\n        }\n        .xo-debug-btn:hover {\n          background: #444;\n        }\n        #xo-debug-panel.collapsed .xo-debug-btn {\n          width: 24px;\n          height: 24px;\n          border-radius: 50%;\n          padding: 0;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-size: 14px;\n        }\n        #xo-debug-badge {\n          position: absolute;\n          top: -4px;\n          right: -4px;\n          background: #dc3545;\n          color: #fff;\n          font-size: 10px;\n          font-weight: bold;\n          min-width: 18px;\n          height: 18px;\n          border-radius: 9px;\n          display: none;\n          align-items: center;\n          justify-content: center;\n          padding: 0 4px;\n          box-shadow: 0 2px 4px rgba(0,0,0,0.3);\n        }\n        #xo-debug-logs {\n          flex: 1;\n          overflow-y: auto;\n          padding: 8px 0;\n          max-height: 260px;\n          background: #1a1a1a;\n        }\n        #xo-debug-panel.collapsed #xo-debug-logs {\n          display: none;\n        }\n        .xo-log-entry {\n          padding: 6px 12px;\n          display: flex;\n          gap: 8px;\n          border-bottom: 1px solid #2a2a2a;\n        }\n        .xo-log-entry:last-child {\n          border-bottom: none;\n        }\n        .xo-log-time {\n          color: #666;\n          flex-shrink: 0;\n        }\n        .xo-log-icon {\n          flex-shrink: 0;\n          width: 16px;\n        }\n        .xo-log-icon.request { color: #888; }\n        .xo-log-icon.response { color: #fff; }\n        .xo-log-icon.error { color: #ff6b6b; font-weight: bold; }\n        .xo-log-icon.info { color: #666; }\n        .xo-log-content {\n          flex: 1;\n          overflow: hidden;\n        }\n        .xo-log-method {\n          font-weight: 500;\n          color: #fff;\n        }\n        .xo-log-data {\n          color: #888;\n          font-size: 11px;\n          margin-top: 2px;\n          word-break: break-all;\n          max-height: 60px;\n          overflow: hidden;\n          cursor: pointer;\n        }\n        .xo-log-data.expanded {\n          max-height: none;\n        }\n        .xo-log-data:hover {\n          color: #aaa;\n        }\n        .xo-log-copy {\n          background: #333;\n          border: 1px solid #444;\n          border-radius: 4px;\n          color: #aaa;\n          cursor: pointer;\n          padding: 0 8px;\n          font-size: 10px;\n          margin-left: 6px;\n          flex-shrink: 0;\n          height: 22px;\n          line-height: 22px;\n          align-self: flex-start;\n        }\n        .xo-log-copy:hover {\n          background: #444;\n          color: #fff;\n        }\n        .xo-log-copy:active {\n          background: #555;\n        }\n        #xo-debug-empty {\n          text-align: center;\n          color: #666;\n          padding: 20px;\n        }\n        #xo-debug-logs::-webkit-scrollbar {\n          width: 6px;\n        }\n        #xo-debug-logs::-webkit-scrollbar-track {\n          background: transparent;\n        }\n        #xo-debug-logs::-webkit-scrollbar-thumb {\n          background: #444;\n          border-radius: 3px;\n        }\n      </style>\n      <div id=\"xo-debug-header\">\n        <div id=\"xo-debug-title\">XO Debugger</div>\n        <div id=\"xo-debug-actions\">\n          <button class=\"xo-debug-btn\" id=\"xo-debug-toggle\" title=\"Minimizar\">\u2212</button>\n          <span id=\"xo-debug-badge\">0</span>\n        </div>\n      </div>\n      <div id=\"xo-debug-logs\">\n        <div id=\"xo-debug-empty\">Esperando eventos...</div>\n      </div>\n    ";
        document.body.appendChild(this.container);
        this.logList = this.container.querySelector('#xo-debug-logs');
        // Event listeners
        (_a = this.container.querySelector('#xo-debug-header')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
            if (e.target.closest('.xo-debug-btn'))
                return;
            _this.toggle();
        });
        (_b = this.container.querySelector('#xo-debug-toggle')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return _this.toggle(); });
    };
    DebugPanel.prototype.toggle = function () {
        if (!this.container)
            return;
        this.isCollapsed = !this.isCollapsed;
        this.container.classList.toggle('collapsed', this.isCollapsed);
        var btn = this.container.querySelector('#xo-debug-toggle');
        if (btn)
            btn.textContent = this.isCollapsed ? '+' : '−';
        this.updateBadge();
    };
    DebugPanel.prototype.clear = function () {
        this.logs = [];
        this.errorCount = 0;
        if (this.logList) {
            this.logList.innerHTML = '<div id="xo-debug-empty">Esperando eventos...</div>';
        }
        this.updateBadge();
    };
    DebugPanel.prototype.formatTime = function (date) {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    DebugPanel.prototype.getIcon = function (type) {
        switch (type) {
            case 'request': return '→';
            case 'response': return '←';
            case 'error': return '✗';
            case 'info': return 'ℹ';
        }
    };
    DebugPanel.prototype.formatData = function (data) {
        if (data === undefined || data === null)
            return '';
        if (typeof data === 'string')
            return data;
        try {
            return JSON.stringify(data, null, 0);
        }
        catch (_a) {
            return String(data);
        }
    };
    DebugPanel.prototype.log = function (type, method, data) {
        var entry = { timestamp: new Date(), type: type, method: method, data: data };
        this.logs.push(entry);
        if (type === 'error') {
            this.errorCount++;
            this.updateBadge();
        }
        if (!this.logList)
            return;
        // Remover mensaje de "esperando"
        var empty = this.logList.querySelector('#xo-debug-empty');
        if (empty)
            empty.remove();
        var el = document.createElement('div');
        el.className = 'xo-log-entry';
        var dataStr = this.formatData(data);
        var dataHtml = dataStr ? "<div class=\"xo-log-data\" title=\"Click para expandir\">".concat(dataStr, "</div>") : '';
        var copyBtn = "<button class=\"xo-log-copy\">Copy</button>";
        el.innerHTML = "\n      <span class=\"xo-log-time\">".concat(this.formatTime(entry.timestamp), "</span>\n      <span class=\"xo-log-icon ").concat(type, "\">").concat(this.getIcon(type), "</span>\n      <div class=\"xo-log-content\">\n        <span class=\"xo-log-method\">").concat(method, "</span>\n        ").concat(dataHtml, "\n      </div>\n      ").concat(copyBtn, "\n    ");
        // Copy button (compatible con móvil)
        var copyEl = el.querySelector('.xo-log-copy');
        if (copyEl) {
            copyEl.addEventListener('click', function (e) {
                var _a;
                e.stopPropagation();
                var text = "".concat(method, ": ").concat(dataStr);
                // Fallback para móvil
                var textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                textarea.setSelectionRange(0, 99999);
                try {
                    document.execCommand('copy');
                    copyEl.textContent = 'OK';
                }
                catch (_b) {
                    // Intentar con clipboard API como fallback
                    (_a = navigator.clipboard) === null || _a === void 0 ? void 0 : _a.writeText(text).then(function () {
                        copyEl.textContent = 'OK';
                    }).catch(function () {
                        copyEl.textContent = '!';
                    });
                }
                document.body.removeChild(textarea);
                setTimeout(function () { copyEl.textContent = 'Copy'; }, 1500);
            });
        }
        // Toggle expand en data
        var dataEl = el.querySelector('.xo-log-data');
        dataEl === null || dataEl === void 0 ? void 0 : dataEl.addEventListener('click', function () { return dataEl.classList.toggle('expanded'); });
        this.logList.appendChild(el);
        this.logList.scrollTop = this.logList.scrollHeight;
    };
    DebugPanel.prototype.request = function (method, data) {
        this.log('request', method, data);
    };
    DebugPanel.prototype.response = function (method, data) {
        this.log('response', method, data);
    };
    DebugPanel.prototype.error = function (method, data) {
        this.log('error', method, data);
    };
    DebugPanel.prototype.info = function (method, data) {
        this.log('info', method, data);
    };
    DebugPanel.prototype.destroy = function () {
        var _a;
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.remove();
        this.container = null;
        this.logList = null;
    };
    return DebugPanel;
}());
exports.DebugPanel = DebugPanel;
