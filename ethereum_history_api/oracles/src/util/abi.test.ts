import { describe, expect, it } from 'vitest';
import { filterPublic } from './abi.js';
import { Abi } from '@noir-lang/noirc_abi';

const type = { kind: 'field' } as const;

describe('abi', () => {
  it('filterPublic', () => {
    const publicParam = { name: 'a', type, visibility: 'public' } as const;
    const privateParam = { name: 'b', type, visibility: 'private' } as const;
    const abi: Abi = {
      parameters: [publicParam, privateParam],
      param_witnesses: {},
      return_type: null,
      return_witnesses: []
    };

    expect(filterPublic(abi).parameters).toEqual([publicParam]);
  });
});
