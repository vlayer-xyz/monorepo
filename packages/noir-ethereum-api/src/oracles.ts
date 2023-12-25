import { createPublicClient, http, Address } from 'viem'
import { mainnet } from 'viem/chains'
import { decodeHexAddress } from './noir/encode.js'
import { assert } from './assert.js';

async function fetchAccountWithProof(address: Address, storageKeys = []) {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETHEREUM_JSON_RPC_API_URL)
  })
  return client.getProof({address, storageKeys});
}

const getAccount = async (_blockNo: string, address: string[]) => {
  const account = await fetchAccountWithProof(decodeHexAddress(address));
  const result = [
    account.balance.toString(16),
    account.codeHash,
    account.nonce.toString(16),
  ]
  return Promise.resolve(result)
}

export const oracles = async (name: string, args: string[][]) => {
  if (name === "get_account") {
    assert(args.length == 2, "get_account requires 2 arguments");
    assert(args[0].length == 1, "get_account first argument must be a block number");
    assert(args[1].length == 42, "get_account second argument must be an address");
    return await getAccount(args[0][0], <string[]>args[1]);
  }
  return Promise.reject("Unknown oracle");
}
