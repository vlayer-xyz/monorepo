import { PublicClient } from 'viem';
export type Call = {
    method: string;
    arguments: object[];
    result: object;
};
export type GetCalls = {
    getCalls: () => Promise<Call[]>;
};
export type RecordingClient = PublicClient & GetCalls;
export declare const isEthereumApiMethod: (methodName: string) => boolean;
export declare const createRecordingClient: (client: PublicClient) => RecordingClient;
