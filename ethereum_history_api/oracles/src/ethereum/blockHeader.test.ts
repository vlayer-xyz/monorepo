import { readFile } from 'fs/promises';
import { parse } from '../util/json-bigint.js';
import { describe, expect, it } from 'vitest';
import { type GetBlockReturnType } from 'viem';
import { type BlockHeader, calculateBlockHash, calculateBlockHeaderHash, headerToRlp } from './blockHeader.js';
import { blockHeaders } from '../../fixtures/blockHeader.json';

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
  const blocks = parse(await readFile('./fixtures/blocks.json', 'utf-8')) as GetBlockReturnType[];
  for (const block of blocks) {
    it(`block #${block.number}`, () => {
      expect(calculateBlockHash(block)).toBe(block.hash);
    });
  }
});
