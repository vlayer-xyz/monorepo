import { GetBlockReturnType, GetProofReturnType } from 'viem';
import { TransactionReceipt } from '../types.js';

export interface BaseFixture<TResult> {
  method: string;
  arguments: unknown[];
  result: TResult;
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

export interface GetTransactionReceiptsFixture {
  method: 'alchemy_getTransactionReceipts';
  arguments: [bigint];
  result: TransactionReceipt[];
}
