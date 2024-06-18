import { describe, expect, it } from 'vitest';
import { publicInputs } from './abi.js';
import { Abi } from '@noir-lang/noirc_abi';

const type = { kind: 'field' } as const;

describe('abi', () => {
  it('filterPublic', () => {
    const publicParam = { name: 'a', type, visibility: 'public' } as const;
    const privateParam = { name: 'b', type, visibility: 'private' } as const;
    const abi: Abi = {
      parameters: [publicParam, privateParam],
      return_type: null,
      error_types: {}
    };

    expect(publicInputs(abi).parameters).toEqual([publicParam]);
  });
});
