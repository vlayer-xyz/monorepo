import {
  Chain,
  Client,
  createTestClient,
  http,
  publicActions,
  PublicActions,
  RpcSchema,
  TestActions,
  Transport,
  walletActions,
  WalletActions
} from 'viem';
import { Account } from 'viem/accounts';
import { foundry } from 'viem/chains';

export type AnvilClient = Client<
  Transport,
  Chain,
  Account | undefined,
  RpcSchema,
  TestActions & PublicActions & WalletActions
>;

export function createAnvilClient(): AnvilClient {
  return createTestClient({
    chain: foundry,
    mode: 'anvil',
    transport: http()
  })
    .extend(publicActions)
    .extend(walletActions);
}
