import { BaseError } from './base.js';
export type HttpRequestErrorType = HttpRequestError & {
    name: 'HttpRequestError';
};
export declare class HttpRequestError extends BaseError {
    name: string;
    body?: {
        [x: string]: unknown;
    } | {
        [y: string]: unknown;
    }[];
    headers?: Headers;
    status?: number;
    url: string;
    constructor({ body, details, headers, status, url, }: {
        body?: {
            [x: string]: unknown;
        } | {
            [y: string]: unknown;
        }[];
        details?: string;
        headers?: Headers;
        status?: number;
        url: string;
    });
}
export type WebSocketRequestErrorType = WebSocketRequestError & {
    name: 'WebSocketRequestError';
};
export declare class WebSocketRequestError extends BaseError {
    name: string;
    constructor({ body, details, url, }: {
        body: {
            [key: string]: unknown;
        };
        details: string;
        url: string;
    });
}
export type RpcRequestErrorType = RpcRequestError & {
    name: 'RpcRequestError';
};
export declare class RpcRequestError extends BaseError {
    name: string;
    code: number;
    constructor({ body, error, url, }: {
        body: {
            [x: string]: unknown;
        } | {
            [y: string]: unknown;
        }[];
        error: {
            code: number;
            message: string;
        };
        url: string;
    });
}
export type TimeoutErrorType = TimeoutError & {
    name: 'TimeoutError';
};
export declare class TimeoutError extends BaseError {
    name: string;
    constructor({ body, url, }: {
        body: {
            [x: string]: unknown;
        } | {
            [y: string]: unknown;
        }[];
        url: string;
    });
}
//# sourceMappingURL=request.d.ts.map