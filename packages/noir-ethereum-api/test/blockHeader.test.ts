import { describe, expect, it } from 'vitest';
import { BlockHeader, calculateBlockHeaderHash, encodeBlockHeader } from '../src/blockHeader.js';
import { blocks } from './resources/blockHeader.json';


describe('encodeBlockHeader', () => {
  for (let block of blocks) {
    it(block.title, async () => {
      expect(encodeBlockHeader(block.header as BlockHeader)).toBe(block.rlp);
    });
  }
});

describe('calculateBlockHeaderHash', () => {
  for (let block of blocks.filter(b => b.hash)) {
    it(block.title, async () => {
      expect(calculateBlockHeaderHash(block.header as BlockHeader)).toBe(block.hash);
    });
  }
});
