import { describe, expect, it } from 'vitest';
import { BlockHeader, calculateBlockHeaderHash, encodeBlockHeader } from '../src/ethereum/blockHeader.js';
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
