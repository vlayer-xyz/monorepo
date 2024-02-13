import { Chain, Client, PublicActions, RpcSchema, TestActions, Transport, WalletActions } from 'viem';
import { Account } from 'viem/accounts';
export type AnvilClient = Client<Transport, Chain, Account | undefined, RpcSchema, TestActions & PublicActions & WalletActions>;
export declare function createAnvilClient(): AnvilClient;
