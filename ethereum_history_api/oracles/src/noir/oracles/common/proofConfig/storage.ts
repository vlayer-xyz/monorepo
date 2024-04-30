import { BYTES32_LEN } from '../const.js';
import { getProofConfig } from '../proofConfig.js';

const KEY_LEN = BYTES32_LEN;
const VALUE_LEN = BYTES32_LEN;
const MAX_PROOF_LEVELS = 7;

export const storageProofConfig = getProofConfig(KEY_LEN, VALUE_LEN, MAX_PROOF_LEVELS);
