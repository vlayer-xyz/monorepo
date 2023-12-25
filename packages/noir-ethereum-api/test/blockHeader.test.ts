import { describe, expect, it } from 'vitest';
import { BlockHeader, calculateBlockHash, calculateBlockHeaderHash, encodeBlockHeader } from '../src/ethereum/blockHeader.js';
import { createDefaultClient } from '../src/ethereum/client.js';
import { fetchBlock } from '../src/noir/oracles.js';
import { blockHeaders } from './resources/blockHeader.json';

for (let block of blockHeaders) {

  describe('encodeBlockHeader', () => {
    it(block.title, async () => {
      expect(encodeBlockHeader(block.header as BlockHeader)).toBe(block.rlp);
    });
  });

  describe('calculateBlockHeaderHash', () => {
    it(block.title, async () => {
      expect(calculateBlockHeaderHash(block.header as BlockHeader)).toBe(block.hash);
    });
  });

}

describe('blockToHeader', () => {
  const blocks = [
    1n,
    1000n,
    100000n,
    1000000n,
    10000000n,
    11000000n,
    12000000n,
    13000000n,
    14000000n,
    15000000n,
    16000000n,
    17000000n
  ];
  for (let n of blocks) {
    it(`blocks: ${n}`, async () => {
      const block = await fetchBlock(createDefaultClient(), n);
      expect(calculateBlockHash(block)).toBe(block.hash);
    }, 1000000)
  }
});
