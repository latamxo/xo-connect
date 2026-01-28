export type LogType = 'request' | 'response' | 'error' | 'info';
export interface LogEntry {
    timestamp: Date;
    type: LogType;
    method: string;
    data?: any;
}
export declare class DebugPanel {
    private container;
    private logList;
    private isCollapsed;
    private logs;
    private errorCount;
    constructor();
    private init;
    private renderPendingLogs;
    private logInitialState;
    private showFallbackError;
    private captureGlobalErrors;
    private captureConsoleLogs;
    private updateBadge;
    private createPanel;
    private toggle;
    private clear;
    private formatTime;
    private getIcon;
    private formatData;
    log(type: LogType, method: string, data?: any): void;
    request(method: string, data?: any): void;
    response(method: string, data?: any): void;
    error(method: string, data?: any): void;
    info(method: string, data?: any): void;
    destroy(): void;
}
