import { describe, it, expect } from 'vitest';
import { BaseTrie } from './trie.js';

describe('BaseTrie', () => {
  describe('keyFromIndex', () => {
    it('0', () => {
      expect(BaseTrie.keyFromIdx(0)).toEqual(new Uint8Array([128]));
    });
    it('1', () => {
      expect(BaseTrie.keyFromIdx(1)).toEqual(new Uint8Array([1]));
    });
    it('256', () => {
      expect(BaseTrie.keyFromIdx(256)).toEqual(new Uint8Array([130, 1, 0]));
    });
  });
});
