import {
  Chain,
  Client,
  Hex,
  PublicRpcSchema,
  RpcTransactionReceipt,
  TransactionReceipt,
  Transport,
  formatTransactionReceipt
} from 'viem';
import { toHexString } from './blockHeader.js';
import { ExtendedActions } from './client.js';

export type AlchemyClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined
> = Client<transport, chain, undefined, PublicRpcSchema | [AlchemyGetTransactionReceiptsRpcSchema]>;

type AlchemyActions = (client: AlchemyClient) => ExtendedActions;

export function alchemyActions(): AlchemyActions {
  return (client: AlchemyClient) => {
    return {
      getTransactionReceipts: (args) => getTransactionReceipts(client, args)
    };
  };
}

export interface AlchemyGetTransactionReceiptsRpcSchema {
  Method: 'alchemy_getTransactionReceipts';
  Parameters: { blockNumber: Hex };
  ReturnType: { receipts: RpcTransactionReceipt[] };
}

export interface GetTransactionReceiptsParameters {
  blockNumber: bigint;
}

export async function getTransactionReceipts(
  client: AlchemyClient,
  params: GetTransactionReceiptsParameters
): Promise<TransactionReceipt[]> {
  const { receipts } = await client.request({
    method: 'alchemy_getTransactionReceipts',
    params: { blockNumber: toHexString(params.blockNumber) }
  });

  if (!receipts) throw new Error(`No receipts found for block number ${params.blockNumber}`);

  return receipts.map(formatTransactionReceipt);
}
