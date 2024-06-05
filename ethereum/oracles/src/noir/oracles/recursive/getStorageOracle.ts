import { ForeignCallOutput } from '@noir-lang/noir_js';
import { NoirArguments } from '../types.js';
import { decodeGetProofArguments } from '../rpc/proofOracle.js';
import { GetStorageProver } from '../../circuit/provers/getStorage.js';
import { MonorepoCircuit } from '../../circuit/circuit.js';
import { VerificationKey } from '../../circuit/vk.js';

export const getStorageOracle = async (args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const { blockNumber, address, storageKey, chainId } = decodeGetProofArguments(args);
  const circuit = await MonorepoCircuit.create('../../', 'get_storage_recursive');
  const vk = await VerificationKey.create(circuit.vkAsFieldsPath());
  const { proofAsFields, verifierData } = await new GetStorageProver(circuit).prove(
    chainId,
    blockNumber,
    address,
    storageKey
  );
  return [verifierData.returnValues(), vk.hash, vk.asFields, proofAsFields];
};
