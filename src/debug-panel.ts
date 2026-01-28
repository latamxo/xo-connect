export type LogType = 'request' | 'response' | 'error' | 'info';

export interface LogEntry {
  timestamp: Date;
  type: LogType;
  method: string;
  data?: any;
}

export class DebugPanel {
  private container: HTMLElement | null = null;
  private logList: HTMLElement | null = null;
  private isCollapsed = false;
  private logs: LogEntry[] = [];
  private errorCount = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      // Esperar a que el DOM esté listo
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        this.init();
      }
    }
  }

  private init() {
    try {
      this.createPanel();
      this.renderPendingLogs();
      this.captureGlobalErrors();
      this.captureConsoleLogs();
      this.logInitialState();
    } catch (e: any) {
      // Si falla la creación del panel, intentar mostrar error básico
      this.showFallbackError(e);
    }
  }

  private renderPendingLogs() {
    // Renderizar logs que se acumularon antes de que el panel estuviera listo
    const pendingLogs = [...this.logs];
    this.logs = [];
    for (const entry of pendingLogs) {
      this.log(entry.type, entry.method, entry.data);
    }
  }

  private logInitialState() {
    this.log('info', 'Debug Panel', 'Iniciado');
    this.log('info', 'URL', window.location.href);
    this.log('info', 'XOConnect', (window as any).XOConnect ? 'Detectado ✓' : 'No detectado ✗');
    this.log('info', 'ReactNativeWebView', (window as any).ReactNativeWebView ? 'Detectado ✓' : 'No detectado ✗');

    // Monitorear si XOConnect aparece después
    if (!(window as any).XOConnect) {
      let checks = 0;
      const interval = setInterval(() => {
        checks++;
        if ((window as any).XOConnect) {
          this.log('info', 'XOConnect', `Detectado después de ${checks * 500}ms ✓`);
          clearInterval(interval);
        } else if (checks >= 20) {
          this.log('error', 'XOConnect', 'No detectado después de 10s');
          clearInterval(interval);
        }
      }, 500);
    }
  }

  private showFallbackError(e: any) {
    // Si el panel no se puede crear, mostrar un div simple de error
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;bottom:10px;right:10px;background:red;color:white;padding:10px;z-index:999999;font-size:12px;';
    div.textContent = `XO Debug Error: ${e?.message || e}`;
    document.body?.appendChild(div);
  }

  private captureGlobalErrors() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.log('error', 'JS Error', `${message} (${source}:${lineno})`);
      return false;
    };

    window.onunhandledrejection = (event) => {
      this.log('error', 'Promise Error', event.reason?.message || event.reason);
    };
  }

  private captureConsoleLogs() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      this.log('info', 'console.log', args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      this.log('error', 'console.error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      this.log('info', 'console.warn', args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
      originalWarn.apply(console, args);
    };
  }

  private updateBadge() {
    const badge = this.container?.querySelector('#xo-debug-badge') as HTMLElement;
    if (badge) {
      if (this.errorCount > 0 && this.isCollapsed) {
        badge.textContent = this.errorCount > 99 ? '99+' : String(this.errorCount);
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  private createPanel() {
    // Container principal
    this.container = document.createElement('div');
    this.container.id = 'xo-debug-panel';
    this.container.innerHTML = `
      <style>
        #xo-debug-panel {
          position: fixed;
          bottom: 16px;
          right: 16px;
          width: 380px;
          max-height: 320px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
          font-size: 12px;
          color: #e0e0e0;
          z-index: 999999;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }
        #xo-debug-panel.collapsed {
          width: auto;
          height: 40px;
          max-height: 40px;
          border-radius: 20px;
          overflow: hidden;
        }
        #xo-debug-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #222;
          border-bottom: 1px solid #333;
          border-radius: 12px 12px 0 0;
          cursor: pointer;
          user-select: none;
        }
        #xo-debug-panel.collapsed #xo-debug-header {
          border-radius: 20px;
          border-bottom: none;
          padding: 0 12px;
          height: 40px;
          justify-content: center;
          background: #1a1a1a;
          gap: 10px;
        }
        #xo-debug-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #fff;
        }
        #xo-debug-panel.collapsed #xo-debug-title {
          display: flex;
          font-size: 11px;
        }
        #xo-debug-panel.collapsed #xo-debug-title::before {
          display: none;
        }
        #xo-debug-title::before {
          content: '';
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
        }
        #xo-debug-actions {
          display: flex;
        }
        #xo-debug-panel.collapsed #xo-debug-actions {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .xo-debug-btn {
          background: #333;
          border: 1px solid #444;
          border-radius: 6px;
          color: #fff;
          cursor: pointer;
          padding: 6px 14px;
          font-size: 18px;
          font-weight: bold;
          line-height: 1;
          transition: background 0.2s;
        }
        .xo-debug-btn:hover {
          background: #444;
        }
        #xo-debug-panel.collapsed .xo-debug-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        #xo-debug-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #dc3545;
          color: #fff;
          font-size: 10px;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        #xo-debug-logs {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
          max-height: 260px;
          background: #1a1a1a;
        }
        #xo-debug-panel.collapsed #xo-debug-logs {
          display: none;
        }
        .xo-log-entry {
          padding: 6px 12px;
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #2a2a2a;
        }
        .xo-log-entry:last-child {
          border-bottom: none;
        }
        .xo-log-time {
          color: #666;
          flex-shrink: 0;
        }
        .xo-log-icon {
          flex-shrink: 0;
          width: 16px;
        }
        .xo-log-icon.request { color: #888; }
        .xo-log-icon.response { color: #fff; }
        .xo-log-icon.error { color: #ff6b6b; font-weight: bold; }
        .xo-log-icon.info { color: #666; }
        .xo-log-content {
          flex: 1;
          overflow: hidden;
        }
        .xo-log-method {
          font-weight: 500;
          color: #fff;
        }
        .xo-log-data {
          color: #888;
          font-size: 11px;
          margin-top: 2px;
          word-break: break-all;
          max-height: 60px;
          overflow: hidden;
          cursor: pointer;
        }
        .xo-log-data.expanded {
          max-height: none;
        }
        .xo-log-data:hover {
          color: #aaa;
        }
        .xo-log-copy {
          background: #333;
          border: 1px solid #444;
          border-radius: 4px;
          color: #aaa;
          cursor: pointer;
          padding: 0 8px;
          font-size: 10px;
          margin-left: 6px;
          flex-shrink: 0;
          height: 22px;
          line-height: 22px;
          align-self: flex-start;
        }
        .xo-log-copy:hover {
          background: #444;
          color: #fff;
        }
        .xo-log-copy:active {
          background: #555;
        }
        #xo-debug-empty {
          text-align: center;
          color: #666;
          padding: 20px;
        }
        #xo-debug-logs::-webkit-scrollbar {
          width: 6px;
        }
        #xo-debug-logs::-webkit-scrollbar-track {
          background: transparent;
        }
        #xo-debug-logs::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 3px;
        }
      </style>
      <div id="xo-debug-header">
        <div id="xo-debug-title">XO Debugger</div>
        <div id="xo-debug-actions">
          <button class="xo-debug-btn" id="xo-debug-toggle" title="Minimizar">−</button>
          <span id="xo-debug-badge">0</span>
        </div>
      </div>
      <div id="xo-debug-logs">
        <div id="xo-debug-empty">Esperando eventos...</div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.logList = this.container.querySelector('#xo-debug-logs');

    // Event listeners
    this.container.querySelector('#xo-debug-header')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.xo-debug-btn')) return;
      this.toggle();
    });

    this.container.querySelector('#xo-debug-toggle')?.addEventListener('click', () => this.toggle());
  }

  private toggle() {
    if (!this.container) return;
    this.isCollapsed = !this.isCollapsed;
    this.container.classList.toggle('collapsed', this.isCollapsed);
    const btn = this.container.querySelector('#xo-debug-toggle');
    if (btn) btn.textContent = this.isCollapsed ? '+' : '−';
    this.updateBadge();
  }

  private clear() {
    this.logs = [];
    this.errorCount = 0;
    if (this.logList) {
      this.logList.innerHTML = '<div id="xo-debug-empty">Esperando eventos...</div>';
    }
    this.updateBadge();
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private getIcon(type: LogType): string {
    switch (type) {
      case 'request': return '→';
      case 'response': return '←';
      case 'error': return '✗';
      case 'info': return 'ℹ';
    }
  }

  private formatData(data: any): string {
    if (data === undefined || data === null) return '';
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data, null, 0);
    } catch {
      return String(data);
    }
  }

  log(type: LogType, method: string, data?: any) {
    const entry: LogEntry = { timestamp: new Date(), type, method, data };
    this.logs.push(entry);

    if (type === 'error') {
      this.errorCount++;
      this.updateBadge();
    }

    if (!this.logList) return;

    // Remover mensaje de "esperando"
    const empty = this.logList.querySelector('#xo-debug-empty');
    if (empty) empty.remove();

    const el = document.createElement('div');
    el.className = 'xo-log-entry';

    const dataStr = this.formatData(data);
    const dataHtml = dataStr ? `<div class="xo-log-data" title="Click para expandir">${dataStr}</div>` : '';
    const copyBtn = `<button class="xo-log-copy">Copy</button>`;

    el.innerHTML = `
      <span class="xo-log-time">${this.formatTime(entry.timestamp)}</span>
      <span class="xo-log-icon ${type}">${this.getIcon(type)}</span>
      <div class="xo-log-content">
        <span class="xo-log-method">${method}</span>
        ${dataHtml}
      </div>
      ${copyBtn}
    `;

    // Copy button (compatible con móvil)
    const copyEl = el.querySelector('.xo-log-copy');
    if (copyEl) {
      copyEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = `${method}: ${dataStr}`;

        // Fallback para móvil
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999);

        try {
          document.execCommand('copy');
          copyEl.textContent = 'OK';
        } catch {
          // Intentar con clipboard API como fallback
          navigator.clipboard?.writeText(text).then(() => {
            copyEl.textContent = 'OK';
          }).catch(() => {
            copyEl.textContent = '!';
          });
        }

        document.body.removeChild(textarea);
        setTimeout(() => { copyEl.textContent = 'Copy'; }, 1500);
      });
    }

    // Toggle expand en data
    const dataEl = el.querySelector('.xo-log-data');
    dataEl?.addEventListener('click', () => dataEl.classList.toggle('expanded'));

    this.logList.appendChild(el);
    this.logList.scrollTop = this.logList.scrollHeight;
  }

  request(method: string, data?: any) {
    this.log('request', method, data);
  }

  response(method: string, data?: any) {
    this.log('response', method, data);
  }

  error(method: string, data?: any) {
    this.log('error', method, data);
  }

  info(method: string, data?: any) {
    this.log('info', method, data);
  }

  destroy() {
    this.container?.remove();
    this.container = null;
    this.logList = null;
  }
}
