import dotenv from 'dotenv';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { type AlchemyClient, alchemyActions } from './alchemyClient.js';
import { assert } from '../util/assert.js';

dotenv.config();

export const SEPOLIA_CHAIN_ID = 58_008n;

type ClientMap = Partial<Record<Chain, AlchemyClient>>;

export enum Chain {
  MAINNET = 'mainnet',
  SEPOLIA = 'sepolia'
}

export class MultiChainClient {
  private clientMap: ClientMap;
  private constructor(clientMap: ClientMap) {
    this.clientMap = clientMap;
  }

  public static create(): MultiChainClient {
    return new MultiChainClient({
      [Chain.MAINNET]: MultiChainClient.createDefaultClient(),
      [Chain.SEPOLIA]: MultiChainClient.createSepoliaClient()
    });
  }

  public static createSingleChainClient(chain: Chain, client: AlchemyClient): MultiChainClient {
    return new MultiChainClient({
      [chain]: client
    });
  }

  public getClient(chain: string): AlchemyClient {
    const client = this.clientMap[chain as Chain];
    assert(client !== undefined, `No client for chain ${chain}`);
    return client;
  }

  public getClientByChainId(chainId: bigint): AlchemyClient {
    return this.getClient(MultiChainClient.chainIdToChain(chainId));
  }

  private static chainIdToChain(chainId: bigint): Chain {
    switch (chainId) {
      case 1n:
        return Chain.MAINNET;
      case SEPOLIA_CHAIN_ID:
        return Chain.SEPOLIA;
      default:
        throw new Error(`Unknown chain ID: ${chainId}`);
    }
  }

  private static createDefaultClient(): AlchemyClient {
    return createPublicClient({
      chain: mainnet,
      transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
    }).extend(alchemyActions());
  }

  private static createSepoliaClient(): AlchemyClient {
    return createPublicClient({
      chain: sepolia,
      transport: http(process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA)
    }).extend(alchemyActions());
  }
}

export { AlchemyClient };
