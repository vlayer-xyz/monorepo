import ultraVerifier from '../../../../contracts/out/UltraVerifier.sol/UltraVerifier.json';
import { decodeHexString } from '../noir/noir_js/encode.js';
import { Account } from 'viem/accounts';
import { Hex } from 'viem';
import { WitnessMap } from '@noir-lang/noirc_abi';

export async function verifyStorageProofInSolidity(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  client: any,
  account: Account,
  contractAddress: Hex,
  proof: Uint8Array,
  witnessMap: WitnessMap
): Promise<Hex> {
  return await client.writeContract({
    account,
    address: contractAddress,
    abi: ultraVerifier.abi,
    functionName: 'verify',
    args: [decodeHexString(proof), Array.from(witnessMap.values())]
  });
}
