import { U64_LEN, BYTES32_LEN } from '../const.js';
import { getProofConfig } from '../proofConfig.js';
import { getMaxRlpEncodedSize } from '../util.js';

// TODO: Remove this when we remove legacy fixtures
export const LEGACY_MAX_ACCOUNT_STATE_LEN = 134;

const KEY_LEN = BYTES32_LEN; // Key is a hash of Ethereum address.
const MAX_VALUE_CONTENT_LEN =
  getMaxRlpEncodedSize(U64_LEN) /* Nonce */ +
  getMaxRlpEncodedSize(BYTES32_LEN) /* Balance */ +
  getMaxRlpEncodedSize(BYTES32_LEN) /* Storage root */ +
  getMaxRlpEncodedSize(BYTES32_LEN); /* Code hash */
const MAX_VALUE_LEN = getMaxRlpEncodedSize(MAX_VALUE_CONTENT_LEN);
const MAX_PROOF_LEVELS = 11;

export const accountProofConfig = getProofConfig(KEY_LEN, MAX_VALUE_LEN, MAX_PROOF_LEVELS);
