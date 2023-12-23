import { type HttpRequestErrorType, type RpcRequestErrorType, type TimeoutErrorType, type WebSocketRequestErrorType } from '../errors/request.js';
import { type ChainDisconnectedErrorType, type InternalRpcErrorType, type InvalidInputRpcErrorType, type InvalidParamsRpcErrorType, type InvalidRequestRpcErrorType, type JsonRpcVersionUnsupportedErrorType, type LimitExceededRpcErrorType, type MethodNotFoundRpcErrorType, type MethodNotSupportedRpcErrorType, type ParseRpcErrorType, type ProviderDisconnectedErrorType, type ResourceNotFoundRpcErrorType, type ResourceUnavailableRpcErrorType, type RpcErrorType, type SwitchChainErrorType, type TransactionRejectedRpcErrorType, type UnauthorizedProviderErrorType, type UnknownRpcErrorType, type UnsupportedProviderMethodErrorType, type UserRejectedRequestErrorType } from '../errors/rpc.js';
import type { ErrorType } from '../errors/utils.js';
import type { CreateBatchSchedulerErrorType } from './promise/createBatchScheduler.js';
import { type WithRetryErrorType } from './promise/withRetry.js';
import type { GetSocketErrorType } from './rpc.js';
export type IsDeterministicErrorType = ErrorType;
export declare const isDeterministicError: (error: Error) => boolean;
export type RequestErrorType = ChainDisconnectedErrorType | CreateBatchSchedulerErrorType | HttpRequestErrorType | InternalRpcErrorType | InvalidInputRpcErrorType | InvalidParamsRpcErrorType | InvalidRequestRpcErrorType | GetSocketErrorType | JsonRpcVersionUnsupportedErrorType | LimitExceededRpcErrorType | MethodNotFoundRpcErrorType | MethodNotSupportedRpcErrorType | ParseRpcErrorType | ProviderDisconnectedErrorType | ResourceNotFoundRpcErrorType | ResourceUnavailableRpcErrorType | RpcErrorType | RpcRequestErrorType | SwitchChainErrorType | TimeoutErrorType | TransactionRejectedRpcErrorType | UnauthorizedProviderErrorType | UnknownRpcErrorType | UnsupportedProviderMethodErrorType | UserRejectedRequestErrorType | WebSocketRequestErrorType | WithRetryErrorType | ErrorType;
export declare function buildRequest<TRequest extends (args: any) => Promise<any>>(request: TRequest, { retryDelay, retryCount, }?: {
    retryDelay?: number;
    retryCount?: number;
}): TRequest;
//# sourceMappingURL=buildRequest.d.ts.map