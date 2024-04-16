import { encodeHex, encodeUint8Array } from '../../noir/oracles/common/encode.js';
import { indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { Hex } from 'viem';
import { padArray } from '../../util/array.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { BYTE_HEX_LEN } from '../../util/const.js';

interface ProofFixture {
  key: Hex;
  value: Hex;
  root: Uint8Array;
  proof: {
    nodes: Uint8Array[];
    leaf: Uint8Array;
  };
}

export function createMerkleProofFixture(proofFixture: ProofFixture) {
  const keyHex = encodeHex(proofFixture.key);
  const maxPrefixedKeyNibbleLen = (keyHex.length + 1) * BYTE_HEX_LEN;
  const key = joinArray(padArray(keyHex, maxPrefixedKeyNibbleLen, ZERO_PAD_VALUE, 'left'));
  const value = joinArray(encodeHex(proofFixture.value));
  const root = joinArray(encodeUint8Array(proofFixture.root));
  const nodes = joinArray(proofFixture.proof.nodes.map((node) => indentBlock(joinArray(encodeUint8Array(node)), 1)));
  const leaf = joinArray(encodeUint8Array(proofFixture.proof.leaf));
  return `global key = ${key};\n
global value = ${value};\n
global root = ${root};\n
global nodes = ${nodes};\n
global leaf = ${leaf};
`;
}
