import { readFile } from 'fs/promises';
import { parse } from 'json-bigint';
import { describe, expect, it } from 'vitest';
import { BlockHeader, calculateBlockHash, calculateBlockHeaderHash, encodeBlockHeader } from '../src/ethereum/blockHeader.js';
import { blockHeaders } from './fixtures/blockHeader.json';

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

describe('calculateBlockHash', async () => {
  const blocks = parse(await readFile('./test/fixtures/blocks.json', 'utf-8'));
  for (let block of blocks) {
    it(`block #${block.number}`, async () => {
      expect(calculateBlockHash(block)).toBe(block.hash);
    })
  }
});
