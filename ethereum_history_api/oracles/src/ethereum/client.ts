import dotenv from 'dotenv';
import {
  Chain,
  Client,
  PublicActions,
  PublicRpcSchema,
  TransactionReceipt,
  Transport,
  createPublicClient,
  http
} from 'viem';
import { Prettify, mainnet, sepolia } from 'viem/chains';
import { GetTransactionReceiptsParameters, extendedActions } from './alchemyClient.js';

dotenv.config();

export const createClient = new Map<string, () => AlchemyClient>([
  ['mainnet', createDefaultClient],
  ['sepolia', createSepoliaClient]
]);

export function createDefaultClient(): AlchemyClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
  }).extend(extendedActions());
}

function createSepoliaClient(): AlchemyClient {
  return createPublicClient({
    chain: sepolia,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA)
  }).extend(extendedActions());
}

export type AlchemyClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined
> = Prettify<Client<transport, chain, undefined, PublicRpcSchema, PublicActions<transport, chain> & ExtendedActions>>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ExtendedActions = {
  getTransactionReceipts: (args: GetTransactionReceiptsParameters) => Promise<TransactionReceipt[]>;
};
