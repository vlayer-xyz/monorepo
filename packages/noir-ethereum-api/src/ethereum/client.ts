import { createPublicClient, createTestClient, http, publicActions, type PublicClient, walletActions } from 'viem';
import { foundry, mainnet } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

export function createDefaultClient(): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
  });
}

export function createAnvilClient() {
  return createTestClient({
    chain: foundry,
    mode: 'anvil',
    transport: http()
  })
    .extend(publicActions)
    .extend(walletActions);
}
