import {
  Chain,
  Client,
  Hex,
  PublicActions,
  PublicRpcSchema,
  RpcTransactionReceipt,
  TransactionReceipt,
  Transport,
  formatTransactionReceipt
} from 'viem';
import { toHexString } from './blockHeader.js';
import { ExtendedActions } from './client.js';

export type AlchemyRpcExtendedClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined
> = Client<
  transport,
  chain,
  undefined,
  PublicRpcSchema | AlchemyGetTransactionReceiptsRpcSchema,
  PublicActions<transport, chain>
>;

type AlchemyGetTransactionReceiptsRpcSchema = [
  {
    Method: 'alchemy_getTransactionReceipts';
    Parameters: { blockNumber: Hex };
    ReturnType: { receipts: RpcTransactionReceipt[] };
  }
];

export interface GetTransactionReceiptsParameters {
  blockNumber: bigint;
}

export function extendedActions() {
  return <TTransport extends Transport, TChain extends Chain | undefined = Chain | undefined>(
    client: AlchemyRpcExtendedClient<TTransport, TChain>
  ): ExtendedActions => {
    return {
      getTransactionReceipts: (args) => getTransactionReceipts(client, args)
    };
  };
}

export async function getTransactionReceipts<TChain extends Chain | undefined>(
  client: AlchemyRpcExtendedClient<Transport, TChain>,
  param: GetTransactionReceiptsParameters
): Promise<TransactionReceipt[]> {
  const { receipts } = await client.request({
    method: 'alchemy_getTransactionReceipts',
    params: { blockNumber: toHexString(param.blockNumber) }
  });

  if (!receipts) throw new Error(`No receipts found for block number ${param.blockNumber}`);

  const formattedReceipts: TransactionReceipt[] = receipts.map(formatTransactionReceipt);

  return formattedReceipts;
}
