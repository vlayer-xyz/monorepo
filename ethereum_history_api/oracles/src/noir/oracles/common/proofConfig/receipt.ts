import { getProofConfig } from '../proofConfig.js';

// TODO: Remove this when we remove legacy fixtures
export const LEGACY_MAX_RECEIPT_ENCODED_LEN = 525;
export const LEGACY_MAX_RECEIPT_RLP_LEN = LEGACY_MAX_RECEIPT_ENCODED_LEN - 1;

const MAX_KEY_LEN = 3;
const MAX_PROOF_LEVELS = 7;
const MAX_VALUE_LEN = 1000;
const { maxPrefixedKeyNibbleLen, maxLeafLen, maxProofLen } = getProofConfig(
  MAX_KEY_LEN,
  MAX_VALUE_LEN,
  MAX_PROOF_LEVELS
);

export class ReceiptProofConfigM {
  public static readonly MAX_KEY_LEN = MAX_KEY_LEN;
  public static readonly MAX_PREFIXED_KEY_NIBBLE_LEN = maxPrefixedKeyNibbleLen;
  public static MAX_VALUE_LEN = MAX_VALUE_LEN;
  public static readonly MAX_LEAF_LEN = maxLeafLen;
  public static readonly MAX_PROOF_LEVELS = MAX_PROOF_LEVELS;
  public static readonly MAX_PROOF_LEN = maxProofLen;
}
