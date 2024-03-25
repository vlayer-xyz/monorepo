import { describe, expect, it } from 'vitest';
import { addPrefix, hasPrefix, padToEven, removePrefix } from './hex.js';

describe('hex', () => {
  it('hasPrefix', () => {
    expect(hasPrefix('0x01')).toEqual(true);
    expect(hasPrefix('01')).toEqual(false);
  });

  it('removePrefix', () => {
    expect(removePrefix('0x01')).toEqual('01');

    expect(() => removePrefix('01')).toThrow('Expected hex to have a prefix: 01');
  });

  it('addPrefix', () => {
    expect(addPrefix('1')).toEqual('0x1');
    expect(addPrefix('01')).toEqual('0x01');

    expect(() => addPrefix('0x01')).toThrow('Expected hex to not have a prefix: 0x01');
  });

  it('padToEven', () => {
    expect(padToEven('1')).toEqual('01');
    expect(padToEven('0x1')).toEqual('0x01');
    expect(padToEven('0x01')).toEqual('0x01');
  });
});
