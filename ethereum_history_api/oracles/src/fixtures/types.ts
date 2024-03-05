import { GetBlockReturnType, GetProofReturnType } from 'viem';

export interface GetProofFixture {
  method: 'eth_getProof';
  arguments: [string, string[], bigint];
  result: GetProofReturnType;
}

export interface GetBlockFixture {
  method: 'eth_getBlockByHash';
  arguments: [bigint, boolean];
  result: GetBlockReturnType;
}
