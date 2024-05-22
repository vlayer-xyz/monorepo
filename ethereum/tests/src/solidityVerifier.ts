import { decodeHexString } from 'noir-ethereum-api-oracles/src/noir/noir_js/encode.js';
import { privateKeyToAccount } from 'viem/accounts';
import { Abi, Address, Hex, TransactionExecutionError } from 'viem';
import { WitnessMap } from '@noir-lang/noirc_abi';
import { assert } from 'noir-ethereum-api-oracles';
import { createAnvilClient } from './ethereum/anvilClient.js';

export const VERIFICATION_GAS_LIMIT = 850_000n;

const PAIRING_FAILED_SELECTOR = 'd71fd263';

const ANVIL_TEST_ACCOUNT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const account = privateKeyToAccount(ANVIL_TEST_ACCOUNT_PRIVATE_KEY);
const client = createAnvilClient();

export interface FoundryArtefact {
  abi: Abi;
  bytecode: {
    object: Hex;
  };
}

export async function deploySolidityProofVerifier(artefact: FoundryArtefact): Promise<SolidityProofVerifier> {
  const hash = await client.deployContract({
    abi: artefact.abi,
    account,
    bytecode: artefact.bytecode.object,
    chain: client.chain
  });

  const txReceipt = await client.waitForTransactionReceipt({ hash });

  if (txReceipt.status !== 'success') {
    throw new Error('Contract deployment failed');
  }

  assert(!!txReceipt.contractAddress, 'Deployed contract address should not be empty');

  const solidityProofVerifier = new SolidityProofVerifier(txReceipt.contractAddress, artefact.abi);
  return solidityProofVerifier;
}

export class SolidityProofVerifier {
  constructor(
    private readonly contractAddress: Address,
    private readonly abi: Abi
  ) {}

  private contractParams = {
    account,
    abi: this.abi,
    chain: client.chain,
    address: this.contractAddress
  };

  async verify(proof: Uint8Array, witnessMap: WitnessMap): Promise<boolean> {
    let hash;
    try {
      hash = await client.writeContract({
        ...this.contractParams,
        functionName: 'verify',
        args: [decodeHexString(proof), Array.from(witnessMap.values())]
      });
    } catch (e: unknown) {
      if (SolidityProofVerifier.isProofFailureRevert(e)) {
        return false;
      }
      throw e;
    }

    const txReceipt = await client.waitForTransactionReceipt({ hash });

    if (txReceipt.status !== 'success') {
      throw new Error('Proof verification failed');
    }

    if (txReceipt.gasUsed > VERIFICATION_GAS_LIMIT) {
      throw new Error('Proof verification exceeded gas limit');
    }

    return true;
  }

  private static isProofFailureRevert(e: unknown): boolean {
    return (
      e instanceof TransactionExecutionError &&
      e.shortMessage === `Execution reverted with reason: custom error ${PAIRING_FAILED_SELECTOR}:.`
    );
  }
}
