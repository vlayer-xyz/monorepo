import { getProofConfig } from '../proofConfig.js';

// TODO: Remove this when we remove legacy fixtures
export const LEGACY_MAX_RECEIPT_ENCODED_LEN = 525;
export const LEGACY_MAX_RECEIPT_RLP_LEN = LEGACY_MAX_RECEIPT_ENCODED_LEN - 1;

const MAX_KEY_LEN = 3;
const MAX_PROOF_LEVELS = 7;
const MAX_VALUE_LEN = 1000;

export const receiptProofConfigM = getProofConfig(MAX_KEY_LEN, MAX_VALUE_LEN, MAX_PROOF_LEVELS);
