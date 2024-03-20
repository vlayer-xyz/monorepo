import { describe, it, expect } from 'vitest';
import { BaseTrie } from './trie.js';

describe('BaseTrie', () => {
  describe('keyFromIndex', () => {
    it('0', () => {
      expect(BaseTrie.keyFromIdx(0)).toEqual('0x80');
    });
    it('1', () => {
      expect(BaseTrie.keyFromIdx(1)).toEqual('0x01');
    });
    it('256', () => {
      expect(BaseTrie.keyFromIdx(256)).toEqual('0x820100');
    });
  });
});
