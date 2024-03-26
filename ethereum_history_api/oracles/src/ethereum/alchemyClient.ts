import { Chain, Client, PublicActions, PublicClient, PublicRpcSchema, Transport } from 'viem';
import {
  AlchemyGetTransactionReceiptsRpcSchema,
  GetTransactionReceiptsParameters,
  getTransactionReceipts
} from './alchemyClientActions/getTransactionReceipts.js';
import { Prettify } from 'viem/chains';
import { TransactionReceipt } from '../types.js';

export type AlchemyClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined
> = Prettify<
  Client<
    transport,
    chain,
    undefined,
    PublicRpcSchema & [AlchemyGetTransactionReceiptsRpcSchema],
    PublicActions & AlchemyActions
  >
>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AlchemyActions = {
  getTransactionReceipts: (args: GetTransactionReceiptsParameters) => Promise<TransactionReceipt[]>;
};

type AlchemyActionsFactory = (client: PublicClient) => AlchemyActions;

export function alchemyActions(): AlchemyActionsFactory {
  return (client: PublicClient) => {
    return {
      getTransactionReceipts: (args) => getTransactionReceipts(client, args)
    };
  };
}
