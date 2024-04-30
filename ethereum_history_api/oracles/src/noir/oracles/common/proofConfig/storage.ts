import { BYTES32_LEN } from '../const.js';
import { getProofConfig } from '../proofConfig.js';

const KEY_LEN = BYTES32_LEN;
const VALUE_LEN = BYTES32_LEN;
const MAX_PROOF_LEVELS = 7;
const { maxPrefixedKeyNibbleLen, maxLeafLen, maxProofLen } = getProofConfig(KEY_LEN, VALUE_LEN, MAX_PROOF_LEVELS);

export class StorageProofConfig {
  public static readonly MAX_PREFIXED_KEY_NIBBLE_LEN = maxPrefixedKeyNibbleLen;
  public static readonly MAX_VALUE_LEN = VALUE_LEN;
  public static readonly MAX_LEAF_LEN = maxLeafLen;
  public static readonly MAX_PROOF_LEVELS = MAX_PROOF_LEVELS;
  public static readonly MAX_PROOF_LEN = maxProofLen;
}
