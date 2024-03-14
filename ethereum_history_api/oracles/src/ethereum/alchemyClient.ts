import { Chain, Client, PublicRpcSchema, TransactionReceipt, Transport } from 'viem';
import {
  AlchemyGetTransactionReceiptsRpcSchema,
  GetTransactionReceiptsParameters,
  getTransactionReceipts
} from './alchemyClientActions/getTransactionReceipts.js';

export type AlchemyClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined
> = Client<transport, chain, undefined, PublicRpcSchema | [AlchemyGetTransactionReceiptsRpcSchema]>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AlchemyActions = {
  getTransactionReceipts: (args: GetTransactionReceiptsParameters) => Promise<TransactionReceipt[]>;
};

type AlchemyActionsFactory = (client: AlchemyClient) => AlchemyActions;

export function alchemyActions(): AlchemyActionsFactory {
  return (client: AlchemyClient) => {
    return {
      getTransactionReceipts: (args) => getTransactionReceipts(client, args)
    };
  };
}
