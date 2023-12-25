import { PublicClient, Address } from 'viem';
import { assert } from '../assert.js';
import { decodeHexAddress } from '../noir/encode.js';
import { createDefaultClient } from '../ethereum/client.js';
import { encodeField } from './encode.js';


async function fetchAccountWithProof(client: PublicClient, address: Address, storageKeys = []) {
  return client.getProof({address, storageKeys});
}

const getAccountOracle = async (client: PublicClient, args: string[][]) => {
  assert(args.length == 2, "get_account requires 2 arguments");
  assert(args[0].length == 1, "get_account first argument must be a block number");
  assert(args[1].length == 42, "get_account second argument must be an address");
  const address = decodeHexAddress(args[1]);
  const account = await fetchAccountWithProof(client, address);
  return [
    encodeField(account.balance),
    account.codeHash,
    encodeField(account.nonce),
  ]
}

export const oracles = async (name: string, args: string[][]) => {
  if (name === "get_account") {
    return await getAccountOracle(createDefaultClient(), args);
  }
  return Promise.reject("Unknown oracle");
}

