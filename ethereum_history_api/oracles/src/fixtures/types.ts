import { GetBlockReturnType, GetProofReturnType } from 'viem';

export interface BaseFixture<T> {
  method: string;
  arguments: unknown[];
  result: T;
}

export interface GetProofFixture {
  method: 'eth_getProof';
  arguments: [string, string[], bigint];
  result: GetProofReturnType;
}

export interface GetBlockFixture<TIncludeTransactions extends boolean> {
  method: 'eth_getBlockByHash';
  arguments: [bigint, boolean];
  result: GetBlockReturnType<undefined, TIncludeTransactions>;
}
