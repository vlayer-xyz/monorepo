import { describe, expect, it } from 'vitest';
import { createMockMultiChainClient } from '../../../ethereum/mockClient.js';
import { padArray } from '../../../util/array.js';
import { OFFSETS, getTransactionOracle } from './transactionOracle.js';
import { ZERO_PAD_VALUE } from '../common/const.js';
import { MAX_DATA_LEN_M } from './common/txConfig.js';
import { txProofConfigM } from './common/proofConfig/tx.js';

describe('getTransactionOracle', () => {
  it('success', async () => {
    const cancunBlockNumberInNoirFormat = '0x12884e1';
    const chainLinkTransferTxIdInNoirFormat = '0x08';
    const mainnetChainIdInNoirFormat = '0x01';
    const mockFilePaths = [
      './fixtures/mainnet/cancun/small_block/eth_getBlockByHash_19432673_includeTransactions.json'
    ];
    const multiChainClient = await createMockMultiChainClient(mockFilePaths);

    const txWithProof = await getTransactionOracle(multiChainClient, [
      [mainnetChainIdInNoirFormat],
      [cancunBlockNumberInNoirFormat],
      [chainLinkTransferTxIdInNoirFormat]
    ]);

    expect(txWithProof[OFFSETS.TX_TYPE]).toStrictEqual('0x02');
    expect(txWithProof[OFFSETS.NONCE]).toStrictEqual('0x485a');
    expect(txWithProof[OFFSETS.GAS_LIMIT]).toStrictEqual('0x0493e0');
    // prettier-ignore
    expect(txWithProof[OFFSETS.TO]).toStrictEqual([
        '0x51','0x49','0x10','0x77','0x1a','0xf9','0xca','0x65','0x6a','0xf8',
        '0x40','0xdf','0xf8','0x3e','0x82','0x64','0xec','0xf9','0x86','0xca'
    ]);
    expect(txWithProof[OFFSETS.TO_IS_SOME]).toStrictEqual('0x01');
    expect(txWithProof[OFFSETS.VALUE_HI]).toStrictEqual('0x');
    expect(txWithProof[OFFSETS.VALUE_LO]).toStrictEqual('0x');
    // prettier-ignore
    expect(txWithProof[OFFSETS.DATA]).toStrictEqual(padArray([
        '0xa9','0x05','0x9c','0xbb','0x00','0x00','0x00','0x00','0x00','0x00',
        '0x00','0x00','0x00','0x00','0x00','0x00','0x12','0x5f','0x66','0x02',
        '0x39','0x70','0x7c','0x9d','0xe3','0x46','0x2d','0x3f','0xa6','0x33',
        '0xf2','0x72','0x3a','0xd0','0xb8','0x84','0x00','0x00','0x00','0x00',
        '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
        '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x3f',
        '0x44','0x12','0x7f','0xb4','0x3f','0xa1','0x00','0x00'
    ], MAX_DATA_LEN_M, ZERO_PAD_VALUE));
    expect(txWithProof[OFFSETS.DATA_LEN]).toStrictEqual('0x44');
    expect(txWithProof[OFFSETS.V]).toStrictEqual('0x01');
    // prettier-ignore
    expect(txWithProof[OFFSETS.R]).toStrictEqual([
        '0x15','0xe6','0x11','0x34','0x16','0xb7','0x94','0xb1','0x1a','0x4e',
        '0x5f','0xbc','0xcd','0x99','0x08','0x1f','0xee','0xec','0xc4','0xd2',
        '0x13','0xe8','0x3b','0xee','0x92','0x23','0x70','0xb9','0xb5','0xc0',
        '0xd8','0x4a'
    ]);
    // prettier-ignore
    expect(txWithProof[OFFSETS.S]).toStrictEqual([
        '0x45','0x0f','0x27','0x76','0x50','0xe5','0xb7','0x2e','0x45','0x95',
        '0xd1','0xd9','0x86','0xdc','0x05','0x69','0x61','0xf1','0xaa','0xbd',
        '0x4c','0x9e','0xb5','0xa5','0x51','0xd0','0xf4','0x86','0xd8','0x18',
        '0x66','0xf7'
    ]);

    const proofInputKeyPart = txWithProof[OFFSETS.PROOF_INPUT].slice(0, txProofConfigM.maxPrefixedKeyNibbleLen);
    const paddedKey = padArray(['0x08'], txProofConfigM.maxPrefixedKeyNibbleLen, ZERO_PAD_VALUE, 'left');
    expect(proofInputKeyPart).toStrictEqual(paddedKey);
    const proofInputValuePart = txWithProof[OFFSETS.PROOF_INPUT].slice(
      txProofConfigM.maxPrefixedKeyNibbleLen,
      txProofConfigM.maxPrefixedKeyNibbleLen + txProofConfigM.maxValueLen
    );
    expect(proofInputValuePart).toMatchSnapshot();
    const proofInputDepthPart = txWithProof[OFFSETS.PROOF_INPUT][txWithProof[OFFSETS.PROOF_INPUT].length - 1];
    expect(proofInputDepthPart).toStrictEqual('0x03');
  });
});
