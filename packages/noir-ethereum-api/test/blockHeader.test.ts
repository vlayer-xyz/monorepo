import { readFile } from 'fs/promises';
import { parse } from 'json-bigint';
import { describe, expect, it } from 'vitest';
import { BlockHeader, calculateBlockHash, calculateBlockHeaderHash, headerToRlp } from '../src/ethereum/blockHeader.js';
import { blockHeaders } from './fixtures/blockHeader.json';

for (let header of blockHeaders) {

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
  const blocks = parse(await readFile('./test/fixtures/blocks.json', 'utf-8'));
  for (let block of blocks) {
    it(`block #${block.number}`, async () => {
      expect(calculateBlockHash(block)).toBe(block.hash);
    })
  }
});
