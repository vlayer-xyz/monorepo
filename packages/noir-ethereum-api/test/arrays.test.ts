import { describe, expect, it } from 'vitest';
import { padArray } from '../src/arrays.js';

describe('arrays', () => {
  it('padArray right', () => {
    expect(padArray([], 0, 'a')).toEqual([]);
    expect(padArray([], 3, 'a')).toEqual(['a', 'a', 'a']);
    expect(padArray(['b'], 3, 'a')).toEqual(['b', 'a', 'a']);
    expect(padArray(['0x01'], 4, '0x00')).toEqual(['0x01', '0x00', '0x00', '0x00']);
  });

  it('padArray left', () => {
    expect(padArray(['b'], 3, 'a', 'left')).toEqual(['a', 'a', 'b']);
  });

  it('padArray invalid len', () => {
    expect(() => padArray(['a'], 0, 'a')).toThrow('len param: 0 should be greater than array length: 1');
  });
});
