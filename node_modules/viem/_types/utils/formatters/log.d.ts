import type { ErrorType } from '../../errors/utils.js';
import type { Log } from '../../types/log.js';
import type { RpcLog } from '../../types/rpc.js';
export type FormatLogErrorType = ErrorType;
export declare function formatLog(log: Partial<RpcLog>, { args, eventName }?: {
    args?: unknown;
    eventName?: string;
}): Log;
//# sourceMappingURL=log.d.ts.map