import dotenv from 'dotenv';
import { Chain, createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { type AlchemyClient, alchemyActions } from './alchemyClient.js';
import { assert } from '../util/assert.js';

dotenv.config();

/**
 * Chains have three properties:
 * numericId: a unique numeric identifier - used in arguments
 * name: a human-readable name
 * strId: a unique string identifier - used in module names & fixture keys
 */

type ClientMap = Partial<Record<number, AlchemyClient>>;

const chainStrIdToChainId = {
  mainnet: mainnet.id,
  sepolia: sepolia.id
} as Record<string, number>;

export class MultiChainClient {
  private clientMap: ClientMap;
  private constructor(clientMap: ClientMap) {
    this.clientMap = clientMap;
  }

  public static create(): MultiChainClient {
    assert(process.env.ETHEREUM_JSON_RPC_API_URL !== undefined, 'Missing mainnet RLP URL');
    assert(process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA !== undefined, 'Missing sepolia RLP URL');

    return new MultiChainClient({
      [mainnet.id]: MultiChainClient.createClient(sepolia, process.env.ETHEREUM_JSON_RPC_API_URL),
      [sepolia.id]: MultiChainClient.createClient(sepolia, process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA)
    });
  }

  public static from(client: AlchemyClient): MultiChainClient {
    assert(client.chain !== undefined, 'Client is not assigned to a specific chain');
    return new MultiChainClient({
      [client.chain.id]: client
    });
  }

  public getClient(chainStrId: string): AlchemyClient {
    return this.getClientByChainId(MultiChainClient.chainStrIdToChainId(chainStrId));
  }

  public getClientByChainId(chainId: number): AlchemyClient {
    const client = this.clientMap[chainId];
    assert(client !== undefined, `No client for chain ${chainId}`);
    return client;
  }

  private static chainStrIdToChainId(chainStrId: string): number {
    const chainId = chainStrIdToChainId[chainStrId];
    assert(chainId !== undefined, `Unknown chain ID: ${chainStrId}`);
    return chainId;
  }

  private static createClient(chain: Chain, rpcUrl: string): AlchemyClient {
    return createPublicClient({
      chain,
      transport: http(rpcUrl)
    }).extend(alchemyActions());
  }
}

export { AlchemyClient };
