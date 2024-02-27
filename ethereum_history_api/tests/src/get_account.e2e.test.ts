import { beforeEach, describe, expect, it } from 'vitest';
import { copy, updateNestedField, incHexStr } from 'noir-ethereum-api-oracles';
import { Abi, InputMap, abiEncode } from '@noir-lang/noirc_abi';

import getAccountVerifier from '../../contracts/out/GetAccountUltraPLONKVerifier.sol/UltraVerifier.json';
import getAccount from '../../../target/get_account.json';

import { readProofData } from './proofDataReader.js';
import { FoundryArtefact, deploySolidityProofVerifier } from './solidityVerifier.js';

export const abi = getAccount.abi as unknown as Abi;

describe('get_account', async () => {
  let proof: Uint8Array;
  let inputMap: InputMap;
  const proofVerifier = await deploySolidityProofVerifier(getAccountVerifier as FoundryArtefact);

  beforeEach(async () => {
    ({ proof, inputMap } = await readProofData('get_account'));
  });

  it('proof verification successes', async () => {
    const witnessMap = abiEncode(abi, inputMap, inputMap['return']);
    expect(await proofVerifier.verify(proof, witnessMap)).toEqual(true);
  });

  it('proof fails: invalid nonce', async () => {
    updateNestedField(inputMap, ['return', 'nonce'], incHexStr);
    const witnessMapInvalidNonce = abiEncode(abi, inputMap, inputMap['return']);
    expect(await proofVerifier.verify(proof, witnessMapInvalidNonce)).toEqual(false);
  });

  it('proof fails: invalid state root', async () => {
    updateNestedField(inputMap, ['state_root', '0'], incHexStr);
    const witnessMapInvalidStateRoot = abiEncode(abi, inputMap, inputMap['return']);
    expect(await proofVerifier.verify(proof, witnessMapInvalidStateRoot)).toEqual(false);
  });
});
