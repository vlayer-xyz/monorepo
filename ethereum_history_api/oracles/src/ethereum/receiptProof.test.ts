import { describe, it, expect } from 'vitest';
import { getReceiptProof } from './receiptProof.js';
import { createMockClient } from './mockClient.js';

describe('getReceiptProof', () => {
  it('getReceiptProof success', async () => {
    const blockNumber = 19_000_000n;
    const mockFilePaths = [
      './fixtures/mainnet/paris/usdc/eth_getBlockByHash_19000000.json',
      './fixtures/mainnet/paris/usdc/alchemy_getTransactionReceipts_19000000.json'
    ];
    const mockingClient = await createMockClient(mockFilePaths);
    const receiptProof = await getReceiptProof(mockingClient, blockNumber, 0);

    expect(receiptProof).toMatchInlineSnapshot(`
      [
        "0xf90131a01a539af3c7639212a2109c66df8d5984d88440276c3af01e6d0749bd8013a482a0d3e6f6dbfbd3d547ad1136fb9153ecd804b289f315414dc3c84ec8727a71fdb0a099db7c25dbf88d039d315fd0b16f427fe687bbabdfca139a148b14cd3588f332a09778e105ad5b550e9c5d770f894cd14b81450bf1fe70bb8e7ca119838840c1a5a0188669b302d2e014b3da157d77431d02a7714a3e4e4da3c1d41221b37136809ca02bb3d322a2e1eec007869f92260cf2caaba0d99a7e061908697e6bbbaadb5f26a0252fe4fdd2f3f723caf31fae605557b604d62780ad5a0316f2298cb69d00e29da0824b16f624c82d183df3f714a7c8f88142f2b49765193043416249ec977ce28aa04008d1609126f1ac821912ad65b32ff0ed11c3d90036fb7da77e012c9043b99b8080808080808080",
        "0xf851a0cfbf51da485b4551144e494c7cacb6275f8734e70cdd65031844d7cb772fdd23a0b4f89348535cc6df2735cd3132bbf2b46556fc7249a68038dfa4a618be7cb5dd808080808080808080808080808080",
        "0xf9067920b9067502f906710183032d10b9010000200000000010000000000080000000000000000000000000000000000000000000400200000000000000000000000002000000180000004000000000000000000000000000000000000008000000200000400000000088000001000800000000000000000000000000000000000000000000000000000000000010000000000008000000000004000000000000000000000000000200080000004008000000000000000000000000000000000008000000000000000000000000000000000000000012000000000000000000000000000000000000005000000010000000000000200100000000000000000000000000000000000000040008000000000000f90566f89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000000000001d0000f38cc10d0028474a9c180058b091a0000000000000000000000000f5ad62af6f001072c9162d6532b903d894fccffda000000000000000000000000000000000000000000000000003d448b600000000f89b94f25f6d80a743fa1a6dbe33842177b2b2e38b1e49f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000f5ad62af6f001072c9162d6532b903d894fccffda00000000000000000000000000000001d0000f38cc10d0028474a9c180058b091a00000000000000000000000000000000000000000000000002b0c830200000000f87994f5ad62af6f001072c9162d6532b903d894fccffde1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b8400000000000000000000000000000000000000000000000006b1191d283f012560000000000000000000000000000000000000000000000048c205b6a5e420eabf8fc94f5ad62af6f001072c9162d6532b903d894fccffdf863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000000000001d0000f38cc10d0028474a9c180058b091a00000000000000000000000000000001d0000f38cc10d0028474a9c180058b091b88000000000000000000000000000000000000000000000000003d448b600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b0c830200000000f89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000000000001d0000f38cc10d0028474a9c180058b091a000000000000000000000000087949af8b82b56bbd5ceceb046cd4e8901911d28a00000000000000000000000000000000000000000000000000bbf6d1b00000000f89b9488f8ea35e55014faba05e562c98c4ee1cc4adc13f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa000000000000000000000000087949af8b82b56bbd5ceceb046cd4e8901911d28a00000000000000000000000000000001d0000f38cc10d0028474a9c180058b091a0000000000000000000000000000000000000000000000000728040a800000000f8799487949af8b82b56bbd5ceceb046cd4e8901911d28e1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b840000000000000000000000000000000000000000000000003ec7c59938d27a9f0000000000000000000000000000000000000000000000000727f99e26ec49442f8fc9487949af8b82b56bbd5ceceb046cd4e8901911d28f863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000000000001d0000f38cc10d0028474a9c180058b091a00000000000000000000000000000001d0000f38cc10d0028474a9c180058b091b88000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bbf6d1b00000000000000000000000000000000000000000000000000000000728040a8000000000000000000000000000000000000000000000000000000000000000000000000",
      ]
    `);
  });
});
