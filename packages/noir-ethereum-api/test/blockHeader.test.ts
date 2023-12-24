import { describe, expect, it } from 'vitest';
import { blockToHeader, calculateBlockHash, encodeBlockHeader, fetchBlock } from '../src/blockHeader.js';
import { blocks } from './resources/blockHeader.json';



describe('encodeBlockHeader', () => {
  for (let block of blocks) {
    it(block.title, async () => {
      expect(encodeBlockHeader(block.header)).toBe(block.rlp);
    });
  }
});
