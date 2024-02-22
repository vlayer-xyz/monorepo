import { decodeHexString } from 'noir-ethereum-api-oracles/src/noir/noir_js/encode.js';
import { Account } from 'viem/accounts';
import { Abi, Address, Hash, Hex, WalletClient } from 'viem';
import { WitnessMap } from '@noir-lang/noirc_abi';
import { AnvilClient } from './ethereum/anvilClient.js';
import { expect } from 'vitest';
import { assert } from 'noir-ethereum-api-oracles';

export async function verifyStorageProofInSolidity(
  client: WalletClient,
  account: Account,
  contractAddress: Address,
  abi: Abi,
  proof: Uint8Array,
  witnessMap: WitnessMap
): Promise<Hash> {
  return await client.writeContract({
    account,
    address: contractAddress,
    abi,
    functionName: 'verify',
    args: [decodeHexString(proof), Array.from(witnessMap.values())],
    chain: client.chain
  });
}

export interface FoundryArtefact {
  abi: Abi;
  bytecode: {
    object: Hex;
  };
}

export async function deployVerificationContract(
  client: AnvilClient,
  account: Account,
  artefact: FoundryArtefact
): Promise<Address> {
  const deploymentTxHash = await client.deployContract({
    abi: artefact.abi,
    account,
    bytecode: artefact.bytecode.object,
    chain: client.chain
  });

  const deploymentTxReceipt = await client.waitForTransactionReceipt({ hash: deploymentTxHash });
  expect(deploymentTxReceipt.status).toEqual('success');

  assert(!!deploymentTxReceipt.contractAddress, 'Deployed contract address should not be empty');
  return deploymentTxReceipt.contractAddress!;
}
