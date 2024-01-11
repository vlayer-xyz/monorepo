import {
  createPublicClient,
  GetBlockParameters,
  GetBlockReturnType,
  GetProofParameters,
  GetProofReturnType,
  http,
  type PublicClient
} from 'viem';
import { mainnet } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

export function createDefaultClient(): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
  });
}

export interface Recordings {
  method: string;
  arguments: object;
  result: object;
}

export function recordingClient(client: PublicClient): PublicClient & { getRecordings: () => Recordings[] } {
  const records: Recordings[] = [];

  return {
    ...client,
    getProof: async (args: GetProofParameters): Promise<GetProofReturnType> => {
      const proof = await client.getProof(args);
      records.push({
        method: 'getProof',
        arguments: args,
        result: proof
      });
      return proof;
    },
    getBlock: async (args: GetBlockParameters): Promise<GetBlockReturnType> => {
      const block: GetBlockReturnType = (await client.getBlock(args)) as GetBlockReturnType;
      records.push({
        method: 'getBlock',
        arguments: args,
        result: block
      });
      return block;
    },
    getRecordings: () => records
  } as PublicClient & { getRecordings: () => Recordings[] };
}
