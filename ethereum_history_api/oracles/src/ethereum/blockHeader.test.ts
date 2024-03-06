import { describe, expect, it } from 'vitest';
import { calculateBlockHash, calculateBlockHeaderHash, headerToRlp, blockToHeader } from './blockHeader.js';
import { getBlockFixtures } from '../fixtures/blocks.js';
import { readObject } from '../util/file.js';
import { join } from 'path';
import { JS_FIXTURES_DIRECTORY } from '../fixtures/config.js';
import { GetBlockFixture } from '../fixtures/types.js';
import { GetBlockReturnType } from 'viem';

async function loadBlockFixture(hardFork: string, fixtureName: string): Promise<GetBlockReturnType> {
  const fileName = join(JS_FIXTURES_DIRECTORY, hardFork, fixtureName, 'eth_getBlockByHash.json');
  const getBlockFixture = await readObject<GetBlockFixture>(fileName);
  return getBlockFixture.result;
}

describe('calculateBlockHeaderHash', () => {
  it('pre-London block', async () => {
    const block = await loadBlockFixture('frontier', 'first');
    const header = blockToHeader(block);
    expect(calculateBlockHeaderHash(header)).toBe(block.hash);
  });
  it('post-London block', async () => {
    const block = await loadBlockFixture('paris', 'usdc');
    const header = blockToHeader(block);
    expect(calculateBlockHeaderHash(header)).toBe(block.hash);
  });
});

describe('encodeBlockHeader', () => {
  it('pre-London block', async () => {
    const block = await loadBlockFixture('frontier', 'first');
    const header = blockToHeader(block);
    const expectedHeaderRlp =
      '0xf90211a0d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d493479405a56e2d52c817161883f50c441c3228cfe54d9fa0d67e4d450343046425ae4271474353857ab860dbc0a1dde64b41b5cd3a532bf3a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008503ff80000001821388808455ba422499476574682f76312e302e302f6c696e75782f676f312e342e32a0969b900de27b6ac6a67742365dd65f55a0526c41fd18e1b16f1a1215c2e66f5988539bd4979fef1ec4';
    expect(headerToRlp(header)).toEqual(expectedHeaderRlp);
  });

  it('post-London block', async () => {
    const block = await loadBlockFixture('paris', 'usdc');
    const header = blockToHeader(block);
    const expectedHeaderRlp =
      '0xf90232a0759e27a5069535949f0a7247ebc999367dbd77964d77ed004ffc8db3d4940248a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d493479495222290dd7278aa3ddd389cc1e1d165cc4bafe5a01ad7b80af0c28bc1489513346d2706885be90abb07f23ca28e50482adb392d61a0410d8efe973613f9463bb25a0c71ccb52b264842f4874510d70dd748fbbeb0b6a044dbbbb92e053ec5030657cf7e854062602a7dbad7890fb43c01009d1d39faf5b9010081a101008600144d8040180c8c2840027104a0d80031c6f9028b61055022063e4556d43e84a0087802a00608378509003a83ca9cfd1420245eed68d217280b016086100945109e1bbc614b28a248a1a2d881e19700c408aa02803d30c92d02c07c811d100200ab4f05e9502102240842a0890868a80084cbc96009d3040c4d09221d83da8911054c305c62422a0cd128b75240834312c6dea00110c04a18b034062068801bc02880899010c00a535d98753580c830ae81003d8529741108825b525030de0a082448090a8846480f991013e1820a448024551559205e44b5a0020050a9014a14d0a0004c20780aa08c31745eb688421c50540418c04361424c4d80840121eac08401c9c3808392afc98465a2e1c38f6265617665726275696c642e6f7267a0b45e3fdbc1a41216ad07ac931215c5d6df190217efade280d1825c4a667ad2038800000000000000008504abff88bca05ef785b1e235d0641dded9d2c3fd5c501002d353101ed0f53434881d5ca49286';
    expect(headerToRlp(header)).toEqual(expectedHeaderRlp);
  });
});

describe('calculateBlockHash', async () => {
  const blocks = await getBlockFixtures();
  for (const block of blocks) {
    it(`block #${block.number}`, async () => {
      expect(calculateBlockHash(block)).toBe(block.hash);
    });
  }
});
