import { describe, expect, it } from 'vitest';
import { getBlock, getHeaderOracle } from './headerOracle.js';
import { type BlockHeader } from '../../ethereum/blockHeader.js';
import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { createMockClient } from '../../ethereum/mockClient.js';
import { FIXTURES } from '../../fixtures/config.js';

describe('headerOracle', async () => {
  const mockFilePaths = ['./fixtures/paris/usdc/eth_getBlockByHash.json'];
  const client = await createMockClient(mockFilePaths);

  it('getBlock', async () => {
    const blockNumber = FIXTURES.paris.usdc.blockNumber;
    const blockHeader: BlockHeader = await getBlock(client, blockNumber);
    expect(blockHeader.number).toStrictEqual('0x121eac0');
    expect(blockHeader.parentHash).toStrictEqual('0x759e27a5069535949f0a7247ebc999367dbd77964d77ed004ffc8db3d4940248');
    expect(blockHeader.difficulty).toStrictEqual('0x0');
  });

  it('getHeaderOracle', async () => {
    const blockHeader: ForeignCallOutput[] = await getHeaderOracle(client, [['0x121eac0']]);
    expect(blockHeader.length === 7);
    // prettier-ignore
    const encodedStateRootOfParisBlockBlock = [
        "0x1a","0xd7","0xb8","0x0a","0xf0","0xc2","0x8b","0xc1",
        "0x48","0x95","0x13","0x34","0x6d","0x27","0x06","0x88",
        "0x5b","0xe9","0x0a","0xbb","0x07","0xf2","0x3c","0xa2",
        "0x8e","0x50","0x48","0x2a","0xdb","0x39","0x2d","0x61"
      ];
    expect(blockHeader[2]).toStrictEqual(encodedStateRootOfParisBlockBlock);
  });
});
