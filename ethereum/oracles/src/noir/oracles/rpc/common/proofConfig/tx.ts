import { BYTE_HEX_LEN } from '../../../../../util/const.js';
import { getProofConfig } from '../proofConfig.js';

// TODO: Remove this when we remove legacy fixtures
export const MAX_TX_ENCODED_LEN_M = 1000;
export const MAX_TX_RLP_LEN_M = MAX_TX_ENCODED_LEN_M - 1;

const MAX_KEY_LEN = 3;
const MAX_PROOF_LEVELS = MAX_KEY_LEN * BYTE_HEX_LEN + 1; // Path with N nibbles has N + 1 levels

export const txProofConfigM = getProofConfig(MAX_KEY_LEN, MAX_TX_ENCODED_LEN_M, MAX_PROOF_LEVELS);
