import { MAX_TRIE_NODE_LEN } from '../common/const.js';

export const MAX_TX_KEY_NIBBLE_LEN = 6;
export const MAX_TX_TREE_DEPTH = MAX_TX_KEY_NIBBLE_LEN + 1;
export const MAX_TX_RLP_LEN = MAX_TRIE_NODE_LEN;
export const MAX_TX_PROOF_LEN = MAX_TRIE_NODE_LEN * MAX_TX_TREE_DEPTH;
