import dotenv from 'dotenv';
import { Chain, Client, PublicActions, PublicRpcSchema, Transport, createPublicClient, http } from 'viem';
import { Prettify, mainnet, sepolia } from 'viem/chains';
import { AlchemyActions, alchemyActions } from './alchemyClient.js';
import { AlchemyGetTransactionReceiptsRpcSchema } from './alchemyClientActions/getTransactionReceipts.js';

dotenv.config();

export const createClient = new Map<string, () => AlchemyClient>([
  ['mainnet', createDefaultClient],
  ['sepolia', createSepoliaClient]
]);

export function createDefaultClient(): AlchemyClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
  }).extend(alchemyActions());
}

function createSepoliaClient(): AlchemyClient {
  return createPublicClient({
    chain: sepolia,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA)
  }).extend(alchemyActions());
}

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
