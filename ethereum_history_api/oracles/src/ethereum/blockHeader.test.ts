import { describe, expect, it } from 'vitest';
import { type BlockHeader, calculateBlockHash, calculateBlockHeaderHash, headerToRlp } from './blockHeader.js';
import { blockHeaders } from '../../fixtures/blockHeader.json';
import { getBlockFixtures } from '../fixtures/blocks.js';

for (const header of blockHeaders) {
  describe('encodeBlockHeader', () => {
    it(header.title, () => {
      expect(headerToRlp(header.header as BlockHeader)).toBe(header.rlp);
    });
  });

  describe('calculateBlockHeaderHash', () => {
    it(header.title, () => {
      expect(calculateBlockHeaderHash(header.header as BlockHeader)).toBe(header.hash);
    });
  });
}

describe('calculateBlockHash', async () => {
  const blocks = await getBlockFixtures();
  for (const block of blocks) {
    it(`block #${block.number}`, async () => {
      expect(calculateBlockHash(block)).toBe(block.hash);
    });
  }
});
