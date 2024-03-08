import { createPublicClient, http, type PublicClient } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

export const createClient = new Map<string, () => PublicClient>([
  ['mainnet', createDefaultClient],
  ['sepolia', createSepoliaClient]
]);

function createDefaultClient(): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
  });
}

function createSepoliaClient(): PublicClient {
  return createPublicClient({
    chain: sepolia,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA)
  });
}
