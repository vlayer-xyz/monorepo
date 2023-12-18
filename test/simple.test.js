import { describe, expect, it } from 'vitest'
import { generate_and_verify_simple_proof } from '../src/main.js'
import initNoirAbi, { abiEncode, abiDecode, WitnessMap, Field } from '@noir-lang/noirc_abi';

describe('getAccount', () => {
  it('proof successes', async () => {
    expect(await generate_and_verify_simple_proof({block_no: 18800000})).toEqual(true)
  })

  it('proof fails', async () => {
    await expect(generate_and_verify_simple_proof({block_no: 1})).rejects.toThrow(
      'Circuit execution failed: Error: Cannot satisfy constraint',
    );
  })
})
