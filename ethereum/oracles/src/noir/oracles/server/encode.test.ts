import { describe, it, expect } from 'vitest';
import { decodeNoirArguments, encodeForeignCallResult } from './encode.js';
import { ForeignCallParams, ForeignCallResult } from './types.js';
import { NoirArguments } from '../types.js';

describe('decodeNoirArguments', () => {
  it('should decode a single foreign call param correctly', () => {
    const params = [{ Single: '1a2b3c' }];
    const expected = [['0x1a2b3c']];
    expect(decodeNoirArguments(params)).toEqual(expected);
  });

  it('should decode an array foreign call param correctly', () => {
    const params = [{ Array: ['1a2b3c', '4d5e6f'] }];
    const expected = [['0x1a2b3c', '0x4d5e6f']];
    expect(decodeNoirArguments(params)).toEqual(expected);
  });

  it('should handle mixed params correctly', () => {
    const params = [{ Single: '1a2b3c' }, { Array: ['4d5e6f', '7a8b9c'] }];
    const expected = [['0x1a2b3c'], ['0x4d5e6f', '0x7a8b9c']];
    expect(decodeNoirArguments(params)).toEqual(expected);
  });

  it('should handle empty array correctly', () => {
    const params: ForeignCallParams = [];
    const expected: NoirArguments = [];
    expect(decodeNoirArguments(params)).toEqual(expected);
  });
});

describe('encodeForeignCallResult', () => {
  it('should encode string input correctly', () => {
    const noirOutputs = ['1a2b3c'];
    const expected = { values: [{ Single: '1a2b3c' }] };
    expect(encodeForeignCallResult(noirOutputs)).toEqual(expected);
  });

  it('should encode array input correctly', () => {
    const noirOutputs = [['1a2b3c', '4d5e6f']];
    const expected = {
      values: [{ Array: ['1a2b3c', '4d5e6f'] }]
    };
    expect(encodeForeignCallResult(noirOutputs)).toEqual(expected);
  });

  it('should handle mixed input types correctly', () => {
    const noirOutputs = ['1a2b3c', ['4d5e6f', '7a8b9c']];
    const expected = {
      values: [{ Single: '1a2b3c' }, { Array: ['4d5e6f', '7a8b9c'] }]
    };
    expect(encodeForeignCallResult(noirOutputs)).toEqual(expected);
  });

  it('should handle empty array correctly', () => {
    const noirOutputs: NoirArguments = [];
    const expected: ForeignCallResult = { values: [] };
    expect(encodeForeignCallResult(noirOutputs)).toEqual(expected);
  });
});
