import { describe, expect, it } from 'vitest';
import { getBlock, getHeaderOracle } from '../../../src/noir/oracles/headerOracle.js';
import { createDefaultClient } from '../../../src/ethereum/client.js';
import { type BlockHeader } from '../../../src/ethereum/blockHeader.js';
import { type ForeignCallOutput } from '@noir-lang/noir_js';

describe(
  'headerOracle',
  async () => {
    it('getBlock', async () => {
      const blockHeader: BlockHeader = await getBlock(createDefaultClient(), 0n);
      expect(blockHeader.number).toStrictEqual('0x0');
      expect(blockHeader.parentHash).toStrictEqual(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      );
      expect(blockHeader.difficulty).toStrictEqual('0x400000000');
    });

    it('getHeaderOracle', async () => {
      const blockHeader: ForeignCallOutput[] = await getHeaderOracle(createDefaultClient(), [['0x0']]);
      expect(blockHeader.length === 7);
      // prettier-ignore
      let encodedStateRootOfBlock0 = [
        '0xd7', '0xf8', '0x97', '0x4f', '0xb5', '0xac', '0x78', '0xd9', '0x9b', '0x9a', '0xd5', '0x1', '0x8b', '0xed',
        '0xc2', '0xce', '0xa', '0x72', '0xda', '0xd1', '0x82', '0x7a', '0x17', '0x9', '0xda', '0x30', '0x58', '0xf',
        '0x5', '0x44'
      ];
      expect(blockHeader[0]).toStrictEqual(encodedStateRootOfBlock0);
    });
  },
  {
    timeout: 20000
  }
);
