import { beforeAll, describe, expect, it } from 'vitest';
import { incHexStr } from '../src/util/string.js';
import { circuit, readInputMap, readProof, readWitnessMap, verifyStorageProof } from '../src/main.js';
import { updateNestedField } from '../src/util/object.js';
import { abiEncode, InputMap, WitnessMap } from '@noir-lang/noirc_abi';

import { Account, privateKeyToAccount } from 'viem/accounts';
import { createAnvilClient } from '../src/ethereum/client.js';
import ultraVerifier from '../../../contracts/out/UltraVerifier.sol/UltraVerifier.json';
import { decodeHexString } from '../src/noir/noir_js/encode.js';
import { Hex, isHex, TransactionReceipt } from 'viem';

const PROOF_PATH = '../../proofs/main.proof';
const INPUT_MAP_PATH = '../../circuits/main/Verifier.toml';
const ANVIL_TEST_ACCOUNT_PRIVATE_KEY: Hex = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

describe.concurrent(
  'e2e',
  () => {
    let proof: Uint8Array;
    let inputMap: InputMap;
    let witnessMap: WitnessMap;

    beforeAll(async () => {
      proof = await readProof(PROOF_PATH);
      inputMap = await readInputMap(INPUT_MAP_PATH);
      witnessMap = await readWitnessMap(INPUT_MAP_PATH);
    });

    it('proof verification successes', async () => {
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(true);
    });

    it('anvil smart contract proof verification successes', async () => {
      const client = createAnvilClient();

      const account: Account = privateKeyToAccount(ANVIL_TEST_ACCOUNT_PRIVATE_KEY);

      const contract: Hex = await client.deployContract({
        abi: ultraVerifier.abi,
        account,
        bytecode: ultraVerifier.bytecode.object as Hex
      });

      const transaction: TransactionReceipt = await client.waitForTransactionReceipt({ hash: contract });
      expect(transaction.status).toEqual('success');

      const contractAddress = transaction.contractAddress as Hex;

      const { request: verifyProofRequest } = await client.simulateContract({
        account,
        address: contractAddress,
        abi: ultraVerifier.abi,
        functionName: 'verify',
        args: [decodeHexString(proof), Array.from(witnessMap.values())]
      });
      const proofVerificationTransactionHash = await client.writeContract(verifyProofRequest);
      expect(proofVerificationTransactionHash).toSatisfy(isHex);
    });

    it('proof fails: invalid nonce', async () => {
      updateNestedField(inputMap, ['return', 'nonce'], incHexStr);
      const witnessMap = abiEncode(circuit.abi, inputMap, inputMap['return']);
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(false);
    });

    it('proof fails: invalid state root', async () => {
      updateNestedField(inputMap, ['state_root', '0'], incHexStr);
      const witnessMap = abiEncode(circuit.abi, inputMap, inputMap['return']);
      const proofData = {
        proof,
        publicInputs: Array.from(witnessMap.values())
      };
      expect(await verifyStorageProof(proofData)).toEqual(false);
    });
  },
  {
    timeout: 3 * 60 * 1000
  }
);
