import dotenv from 'dotenv';
import { Chain, createPublicClient, http } from 'viem';
import * as chains from 'viem/chains';
import { type AlchemyClient, alchemyActions } from './alchemyClient.js';
import { assert } from '../util/assert.js';

dotenv.config();

type ClientMap = Partial<Record<number, AlchemyClient>>;

export function getChainByName(chainName: string): Chain {
  const chain = chains[chainName as unknown as keyof typeof chains] as Chain;
  assert(chain !== undefined, `Unknown chain ID: ${chainName}`);
  return chain;
}

export class MultiChainClient {
  private clientMap: ClientMap;
  private constructor(clientMap: ClientMap) {
    this.clientMap = clientMap;
  }

  public static from_env(): MultiChainClient {
    const clientMap: ClientMap = {};

    if (process.env.ETHEREUM_JSON_RPC_API_URL) {
      clientMap[chains.mainnet.id] = MultiChainClient.createClient(
        chains.mainnet,
        process.env.ETHEREUM_JSON_RPC_API_URL
      );
    }
    if (process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA) {
      clientMap[chains.sepolia.id] = MultiChainClient.createClient(
        chains.sepolia,
        process.env.ETHEREUM_JSON_RPC_API_URL_SEPOLIA
      );
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

  public getClient(chainId: number): AlchemyClient {
    const client = this.clientMap[chainId];
    assert(client !== undefined, `No client for chain ${chainId}`);
    return client;
  }

  private static createClient(chain: Chain, rpcUrl: string): AlchemyClient {
    return createPublicClient({
      chain,
      transport: http(rpcUrl)
    }).extend(alchemyActions());
  }
}

export { AlchemyClient };
