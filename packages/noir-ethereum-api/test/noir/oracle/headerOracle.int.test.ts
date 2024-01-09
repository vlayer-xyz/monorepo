import { describe, expect, it } from "vitest";
import { getBlock } from "../../../src/noir/oracles/headerOracle.js";
import { createDefaultClient } from "../../../src/ethereum/client.js";

describe('headerOracle', async () => {
  it('getBlock', async () => {
    const blockHeader = await getBlock(createDefaultClient(), 0n)
    expect(blockHeader.number).toStrictEqual('0x0')
    expect(blockHeader.parentHash).toStrictEqual('0x0000000000000000000000000000000000000000000000000000000000000000')
    expect(blockHeader.difficulty).toStrictEqual('0x400000000')
  })
})
