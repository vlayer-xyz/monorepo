import { createPublicClient, http, type PublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

export function createDefaultClient(): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
  });
}
