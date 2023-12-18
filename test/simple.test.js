import { describe, expect, it } from 'vitest'
import { generate_and_verify_simple_proof } from '../src/main.js'

describe('suite name', () => {
  it('success', async () => {
    expect(await generate_and_verify_simple_proof({ x: 1, y: 2 })).toEqual(true)
  })

  it('fail', async () => {
    await expect(generate_and_verify_simple_proof({ x: 1, y: 1 })).rejects.toThrow(
        'Circuit execution failed: Error: Cannot satisfy constraint',
    );
  })
})
