import { type HttpRequestErrorType, type TimeoutErrorType, WebSocketRequestError } from '../errors/request.js';
import type { ErrorType } from '../errors/utils.js';
import { type CreateBatchSchedulerErrorType } from './promise/createBatchScheduler.js';
import { type WithTimeoutErrorType } from './promise/withTimeout.js';
type SuccessResult<T> = {
    method?: never;
    result: T;
    error?: never;
};
type ErrorResult<T> = {
    method?: never;
    result?: never;
    error: T;
};
type Subscription<TResult, TError> = {
    method: 'eth_subscription';
    error?: never;
    result?: never;
    params: {
        subscription: string;
    } & ({
        result: TResult;
        error?: never;
    } | {
        result?: never;
        error: TError;
    });
};
export type RpcRequest = {
    method: string;
    params?: any;
    id?: number;
};
export type RpcResponse<TResult = any, TError = any> = {
    jsonrpc: `${number}`;
    id: number;
} & (SuccessResult<TResult> | ErrorResult<TError> | Subscription<TResult, TError>);
export type HttpOptions<TBody extends RpcRequest | RpcRequest[] = RpcRequest> = {
    body: TBody;
    fetchOptions?: Omit<RequestInit, 'body'>;
    timeout?: number;
};
export type HttpReturnType<TBody extends RpcRequest | RpcRequest[] = RpcRequest> = TBody extends RpcRequest[] ? RpcResponse[] : RpcResponse;
export type HttpErrorType = HttpRequestErrorType | TimeoutErrorType | WithTimeoutErrorType | ErrorType;
declare function http<TBody extends RpcRequest | RpcRequest[]>(url: string, { body, fetchOptions, timeout }: HttpOptions<TBody>): Promise<HttpReturnType<TBody>>;
type Id = string | number;
type CallbackFn = (message: any) => void;
type CallbackMap = Map<Id, CallbackFn>;
export type Socket = WebSocket & {
    requests: CallbackMap;
    subscriptions: CallbackMap;
};
export type GetSocketErrorType = CreateBatchSchedulerErrorType | ErrorType;
export declare const socketsCache: Map<string, Socket>;
export declare function getSocket(url: string): Promise<Socket>;
export type WebSocketOptions = {
    /** The RPC request body. */
    body: RpcRequest;
    /** The callback to invoke on response. */
    onResponse?: (message: RpcResponse) => void;
};
export type WebSocketReturnType = Socket;
export type WebSocketErrorType = WebSocketRequestError | ErrorType;
declare function webSocket(socket: Socket, { body, onResponse }: WebSocketOptions): WebSocketReturnType;
export type WebSocketAsyncOptions = {
    /** The RPC request body. */
    body: RpcRequest;
    /** The timeout (in ms) for the request. */
    timeout?: number;
};
export type WebSocketAsyncReturnType = RpcResponse;
export type WebSocketAsyncErrorType = WebSocketErrorType | TimeoutErrorType | WithTimeoutErrorType | ErrorType;
declare function webSocketAsync(socket: Socket, { body, timeout }: WebSocketAsyncOptions): Promise<WebSocketAsyncReturnType>;
export declare const rpc: {
    http: typeof http;
    webSocket: typeof webSocket;
    webSocketAsync: typeof webSocketAsync;
};
export {};
//# sourceMappingURL=rpc.d.ts.map