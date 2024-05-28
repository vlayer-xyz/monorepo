import { Address, Hex } from 'viem';
import { BaseProver, VerifiableComputation } from '../baseProver.js';
import { encodeAddress, encodeField, encodeHex } from '../../oracles/common/encode.js';

export class GetStorageProver extends BaseProver {
  public async prove(chainId: number, blockNumber: bigint, address: Address, key: Hex): Promise<VerifiableComputation> {
    const inputs = {
      chain_id: encodeField(chainId),
      block_number: encodeField(blockNumber),
      address: encodeAddress(address),
      storage_key: encodeHex(key)
    };
    return await this.proveBase(inputs);
  }
}
