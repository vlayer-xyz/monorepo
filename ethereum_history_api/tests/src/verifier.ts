import ultraVerifier from '../../contracts/out/UltraVerifier.sol/UltraVerifier.json';
import { decodeHexString } from 'noir-ethereum-api-oracles/src/noir/noir_js/encode.js';
import { Account } from 'viem/accounts';
import { Address, Hash, WalletClient } from 'viem';
import { WitnessMap } from '@noir-lang/noirc_abi';

export async function verifyStorageProofInSolidity(
  client: WalletClient,
  account: Account,
  contractAddress: Address,
  proof: Uint8Array,
  witnessMap: WitnessMap
): Promise<Hash> {
  return await client.writeContract({
    account,
    address: contractAddress,
    abi: ultraVerifier.abi,
    functionName: 'verify',
    args: [decodeHexString(proof), Array.from(witnessMap.values())],
    chain: client.chain
  });
}
