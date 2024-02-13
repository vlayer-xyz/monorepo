import { Account } from 'viem/accounts';
import { Address, Hash, WalletClient } from 'viem';
import { WitnessMap } from '@noir-lang/noirc_abi';
export declare function verifyStorageProofInSolidity(client: WalletClient, account: Account, contractAddress: Address, proof: Uint8Array, witnessMap: WitnessMap): Promise<Hash>;
