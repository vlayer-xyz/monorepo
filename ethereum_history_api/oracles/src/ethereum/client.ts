import dotenv from 'dotenv';
import { Chain, createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { type AlchemyClient, alchemyActions } from './alchemyClient.js';
import { assert } from '../util/assert.js';

dotenv.config();

/**
 * Chains have two types of ids:
 * numericId: a unique numeric identifier - used in arguments. Example: 1, 42
 * strId: a unique string identifier - used in module names & fixture keys. Example: mainnet, sepolia
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
    const clientMap: ClientMap = {};

    if (process.env.ETHEREUM_JSON_RPC_API_URL) {
      clientMap[mainnet.id] = MultiChainClient.createClient(mainnet, process.env.ETHEREUM_JSON_RPC_API_URL);
    }
    if (process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA) {
      clientMap[mainnet.id] = MultiChainClient.createClient(sepolia, process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA);
    }
    assert(Object.keys(clientMap).length !== 0, 'Please provide at least one JSON_RPC_API_URL');

    return new MultiChainClient(clientMap);
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
