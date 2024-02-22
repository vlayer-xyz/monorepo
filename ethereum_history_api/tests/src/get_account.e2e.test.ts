import { describe, expect, it } from 'vitest';
import { copy, updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { abiEncode, WitnessMap } from '@noir-lang/noirc_abi';

import { privateKeyToAccount } from 'viem/accounts';
import getAccountVerifier from '../../contracts/out/GetAccountUltraPLONKVerifier.sol/UltraVerifier.json';
import { Hash } from 'viem';
import { createAnvilClient } from './ethereum/anvilClient.js';
import {
  ANVIL_TEST_ACCOUNT_PRIVATE_KEY,
  VERIFICATION_GAS_LIMIT,
  get_account_circuit,
  readInputMap,
  readProof,
  readWitnessMap
} from './main.js';
import { FoundryArtefact, deployVerificationContract, verifyStorageProofInSolidity } from './verifier.js';

describe('get_account', async () => {
  const account = privateKeyToAccount(ANVIL_TEST_ACCOUNT_PRIVATE_KEY);
  const client = createAnvilClient();
  const PROOF_PATH = '../../proofs/get_account.proof';
  const INPUT_MAP_PATH = '../circuits/get_account/Verifier.toml';
  const proof = await readProof(PROOF_PATH);
  const inputMap = await readInputMap(INPUT_MAP_PATH);
  const witnessMap = await readWitnessMap(INPUT_MAP_PATH, get_account_circuit.abi);
  const verifierArtefact = getAccountVerifier as FoundryArtefact;
  const contractAddress = await deployVerificationContract(client, account, verifierArtefact);

  function verifyProof(witnessMap: WitnessMap): Promise<Hash> {
    return verifyStorageProofInSolidity(client, account, contractAddress, verifierArtefact.abi, proof, witnessMap);
  }

  it('smart contract proof verification successes', async () => {
    const proofVerificationTxHash = await verifyProof(witnessMap);
    const proofVerificationTxReceipt = await client.waitForTransactionReceipt({ hash: proofVerificationTxHash });
    expect(proofVerificationTxReceipt.status).toEqual('success');
    expect(proofVerificationTxReceipt.gasUsed).toBeLessThanOrEqual(VERIFICATION_GAS_LIMIT);
  });

  it('proof fails: invalid nonce', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['return', 'nonce'], incHexStr);
    const witnessMapInvalidNonce = abiEncode(get_account_circuit.abi, inputMapCopy, inputMapCopy['return']);
    expect(async () => verifyProof(witnessMapInvalidNonce)).rejects.toThrowError('Execution reverted');
  });

  it('proof fails: invalid state root', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['state_root', '0'], incHexStr);
    const witnessMapInvalidStateRoot = abiEncode(get_account_circuit.abi, inputMapCopy, inputMapCopy['return']);
    expect(async () => verifyProof(witnessMapInvalidStateRoot)).rejects.toThrowError('Execution reverted');
  });
});
