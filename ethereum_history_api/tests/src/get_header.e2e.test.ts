import { describe, expect, it } from 'vitest';
import { copy, updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { abiEncode, WitnessMap } from '@noir-lang/noirc_abi';

import { privateKeyToAccount } from 'viem/accounts';
import getHeaderVerifier from '../../contracts/out/GetHeaderUltraPLONKVerifier.sol/UltraVerifier.json';
import { Hash } from 'viem';
import { createAnvilClient } from './ethereum/anvilClient.js';
import { get_header_circuit, readInputMap, readProof, readWitnessMap } from './main.js';
import {
  ANVIL_TEST_ACCOUNT_PRIVATE_KEY,
  FoundryArtefact,
  VERIFICATION_GAS_LIMIT,
  deployVerificationContract,
  verifyStorageProofInSolidity
} from './solidityVerifier.js';

const PROOF_PATH = '../../proofs/get_header.proof';
const INPUT_MAP_PATH = '../circuits/get_header/Verifier.toml';

describe('get_header', async () => {
  const account = privateKeyToAccount(ANVIL_TEST_ACCOUNT_PRIVATE_KEY);
  const client = createAnvilClient();
  const proof = await readProof(PROOF_PATH);
  const inputMap = await readInputMap(INPUT_MAP_PATH);
  const witnessMap = await readWitnessMap(INPUT_MAP_PATH, get_header_circuit.abi);
  const verifierArtefact = getHeaderVerifier as FoundryArtefact;
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

  it('proof fails: invalid number', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['return', 'number'], incHexStr);
    const witnessMapInvalidNumber = abiEncode(get_header_circuit.abi, inputMapCopy, inputMapCopy['return']);
    expect(async () => verifyProof(witnessMapInvalidNumber)).rejects.toThrowError('Execution reverted');
  });

  it('proof fails: invalid state_root', async () => {
    const inputMapCopy = copy(inputMap);
    updateNestedField(inputMapCopy, ['return', 'state_root', '0'], incHexStr);
    const witnessMapInvalidStateRoot = abiEncode(get_header_circuit.abi, inputMapCopy, inputMapCopy['return']);
    expect(async () => verifyProof(witnessMapInvalidStateRoot)).rejects.toThrowError('Execution reverted');
  });
});
