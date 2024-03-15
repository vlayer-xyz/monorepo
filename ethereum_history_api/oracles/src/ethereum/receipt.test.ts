import { describe, expect, it } from 'vitest';
import { encodeReceipt, getReceiptProof, logToRlpFields, receiptToRlpFields, txTypeToHex } from './receipt.js';
import { toEventSelector } from 'viem';
import { assert } from '../util/assert.js';
import { loadReceiptFixture } from '../fixtures.js';
import { createDefaultClient } from './client.js';
import { stringify } from 'querystring';

describe('logToRlpFields', () => {
  it(`log`, async () => {
    const chainLinkTransferReceipt = await loadReceiptFixture(
      'mainnet',
      'cancun',
      'small_block',
      '0x98e19df80eb8feae436896cc7cc6d4a97818e6010b56a249352b9ac2caf0d573'
    );
    const transferLog = chainLinkTransferReceipt.logs[0];

    expect(logToRlpFields(transferLog)).toEqual([
      '0x514910771af9ca656af840dff83e8264ecf986ca',
      [
        toEventSelector('Transfer(address,address,uint256)'),
        '0x000000000000000000000000fa4d81487ece32e95ae2bee5fc860f189fe163d8',
        '0x000000000000000000000000125f660239707c9de3462d3fa633f2723ad0b884'
      ],
      '0x00000000000000000000000000000000000000000000003f44127fb43fa10000'
    ]);
  });
});

describe('txTypeToHex', () => {
  it(`legacy`, () => {
    expect(txTypeToHex('legacy')).toEqual('0x00');
  });

  it(`eip155`, () => {
    expect(txTypeToHex('eip155')).toEqual('0x00');
  });

  it(`eip2930`, () => {
    expect(txTypeToHex('eip2930')).toEqual('0x01');
  });

  it(`eip1559`, () => {
    expect(txTypeToHex('eip1559')).toEqual('0x02');
  });

  it(`eip4844`, () => {
    expect(txTypeToHex('eip4844')).toEqual('0x03');
  });

  it(`unknown`, () => {
    expect(() => txTypeToHex('unknown')).toThrowError(`Unknown transaction type: unknown`);
  });
});

describe('receiptToRlpFields', () => {
  it('pre Byzantinum receipt', async () => {
    const homesteadReceipt = await loadReceiptFixture(
      'mainnet',
      'homestead',
      'fork',
      '0xee83a1cd74a17c0c119c48280de365d8b196d8fe93cc388d1202a97d757f4dbe'
    );
    const rlpFields = receiptToRlpFields(homesteadReceipt);

    expect(rlpFields).toMatchInlineSnapshot(`
      [
        "0xec4470dcadf823c65cff92dad244a029cfc5153609f13c82e14a2039e9d14529",
        "0x9e751",
        "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        [],
      ]
    `);
  });

  it(`post Byzantinum receipt`, async () => {
    const legacyReceipt = await loadReceiptFixture(
      'mainnet',
      'cancun',
      'small_block',
      '0x94a8715a083008845fc4983e89627e6a99de9f15d8455cc3fb2c1583f594932a'
    );
    const rlpFields = receiptToRlpFields(legacyReceipt);

    expect(rlpFields).toMatchInlineSnapshot(`
      [
        "0x01",
        "0x8a73c",
        "0x00000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000200000000000000001000000000000000080000000000000000000000000400000000000000000000000000000800000000000000000000000000080000000000000000000000000000000000000000000000000000000080000000000000000000000020000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000001000000000000",
        [
          [
            "0x405154cfaf5ea4ef57b65b86959c73dd079fa312",
            [
              "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
              "0x0000000000000000000000007069eca2855d49926d2bb9508cbceb92e3d26f0b",
              "0x000000000000000000000000c465cc50b7d5a29b9308968f870a4b242a8e1873",
            ],
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          ],
        ],
      ]
    `);
  });
});

describe('encodeReceipt', () => {
  it('legacy receipt', async () => {
    const legacyReceipt = await loadReceiptFixture(
      'mainnet',
      'cancun',
      'small_block',
      '0x94a8715a083008845fc4983e89627e6a99de9f15d8455cc3fb2c1583f594932a'
    );
    assert(legacyReceipt.type === 'legacy', 'Expected legacy receipt type. Please check the fixtures');

    const encodedReceipt = encodeReceipt(legacyReceipt);

    expect(encodedReceipt.startsWith('0x00')).toBeFalsy();
  });

  it('eip2930 receipt', async () => {
    const eip2930Receipt = await loadReceiptFixture(
      'mainnet',
      'cancun',
      'access_list',
      '0x702385c4922ef4476df045495d122c87294de15ad8abad104991458d98765978'
    );
    assert(eip2930Receipt.type === 'eip2930', 'Expected eip2930 receipt type. Please check the fixtures');

    const encodedReceipt = encodeReceipt(eip2930Receipt);

    expect(encodedReceipt.startsWith('0x01')).toBeTruthy();
  });

  it(`eip1559 receipt`, async () => {
    const eip1559Receipt = await loadReceiptFixture(
      'mainnet',
      'cancun',
      'small_block',
      '0x98e19df80eb8feae436896cc7cc6d4a97818e6010b56a249352b9ac2caf0d573'
    );
    assert(eip1559Receipt.type === 'eip1559', 'Expected eip1559 receipt type. Please check the fixtures');

    const encodedReceipt = encodeReceipt(eip1559Receipt);

    expect(encodedReceipt.startsWith('0x02')).toBeTruthy();
  });

  it(`eip4844 receipt`, async () => {
    const eip4344Receipt = await loadReceiptFixture(
      'mainnet',
      'cancun',
      'with_blob',
      '0xd76ce9d036dc7e8491d134f9bc953ebb204545950821d8ada25968fea779a4b2'
    );
    assert(eip4344Receipt.type === 'eip4844', 'Expected eip4844 receipt type. Please check the fixtures');

    const encodedReceipt = encodeReceipt(eip4344Receipt);

    expect(encodedReceipt.startsWith('0x03')).toBeTruthy();
  });
});

describe('getReceiptProof', () => {
  it.only('getReceiptProof success', async () => {
    const BLOCK_NUMBER = 19411701n;
    const client = createDefaultClient();
    const receiptProof = await getReceiptProof(client, BLOCK_NUMBER, 0);

    assert(
      stringify({ receiptProof }) ===
        stringify({
          receiptProof: [
            '0xf871a0f3479e13c3dec522fd4c32615ad70df480edba510cdda8d9bdb12ae5e607aba1a0c3bdc3854587e05e0355bf4b17e09fc5e3923783888a94b4965f7f7fe54faa68808080808080a0d3166b667cf8c0a77a4da7fe750aa40db5717963c50b2fc6ad04a7d8463d12308080808080808080',
            '0xf904c130b904bd02f904b9018302e19ab9010000000000000000000000000000000000000000000000000000000000000004000000000000008000000000000000000002000001080000000000040000200800000000000000080008004008000000000000000000040000000000008000000000000000000000000000000000000000000000000000000010000050000000000000000001000000000000000000000000000000010000000000000000000000020000000000200000100000000004000000000000000000000000000000000000000402000000000000000000000000000000000400000000000800000000400010200000800000020400000000000000000000000000000000000000000000f903aef89b941111111254eeb25477b68fb85ed929f73a960582f842a0b9ed0243fdf00f0545c63a0af8850c090d86bb46682baec4bf3c496814fe4f02a0000000000000000000000000777999be819ffecee44a995560a9d0e97780a30cb8407a45f937345b3587c98d30c19cc470dad19e9f2db657691bad8e9a4e81a5fa360000000000000000000000000000000000000000000000000000000000000000f89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000777999be819ffecee44a995560a9d0e97780a30ca00000000000000000000000008571c129f335832f6bbc76d49414ad2b8371a422a00000000000000000000000000000000000000000000000056bc75e2d63100000f89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000008571c129f335832f6bbc76d49414ad2b8371a422a000000000000000000000000051c72848c68a965f66fa7a88855f9f7784502a7fa00000000000000000000000000000000000000000000000056bc75e2d63100000f89b94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa000000000000000000000000051c72848c68a965f66fa7a88855f9f7784502a7fa0000000000000000000000000a88800cd213da5ae406ce248380802bd53b47647a00000000000000000000000000000000000000000000000000000005db3e3a688f89b94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48f863a08c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925a0000000000000000000000000a88800cd213da5ae406ce248380802bd53b47647a00000000000000000000000001111111254eeb25477b68fb85ed929f73a960582a00000000000000000000000000000000000000000000000000000005db3e3a688f89b94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000a88800cd213da5ae406ce248380802bd53b47647a0000000000000000000000000777999be819ffecee44a995560a9d0e97780a30ca00000000000000000000000000000000000000000000000000000005db3e3a688'
          ]
        }),
      'Incorrect receipt proof'
    );
  });
});
