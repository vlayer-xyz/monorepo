import { describe, expect, it } from 'vitest';
import { encodeBlockHeader, fetchBlock } from '../src/blockHeader.js';
import {blocks} from './resources/blockHeader.json';



describe('blockHeader', () => {
  it('Encode test vectors', async () => {
    expect(encodeBlockHeader(blocks[0].header)).toBe(blocks[0].rlp);
  });
});

