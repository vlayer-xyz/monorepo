import { describe, expect, it } from 'vitest';
import { OFFSETS, getAccountOracle } from './accountOracle.js';
import { createMockMultiChainClient } from '../../../ethereum/mockClient.js';
import { accountProofConfig } from './common/proofConfig/account.js';

describe('accountOracle', () => {
  it('getAccountOracle', async () => {
    const mainnetChainIdInNoirFormat = '0x01';
    // prettier-ignore
    const vitalikAccountAddressInNoirFormat = [
        "0xd8", "0xda", "0x6b", "0xf2", "0x69", "0x64", "0xaf", "0x9d", "0x7e", "0xed", 
        "0x9e", "0x03", "0xe5", "0x34", "0x15", "0xd3", "0x7a", "0xa9", "0x60", "0x45"
      ]
    const londonBlockNumberInNoirFormat = '0xc5d488';
    const mockFilePaths = [
      './fixtures/mainnet/london/vitalik_balance/eth_getBlockByHash_12965000.json',
      './fixtures/mainnet/london/vitalik_balance/eth_getProof_12965000.json'
    ];
    const multiChainClient = await createMockMultiChainClient(mockFilePaths);
    const account = await getAccountOracle(multiChainClient, [
      [mainnetChainIdInNoirFormat],
      [londonBlockNumberInNoirFormat],
      vitalikAccountAddressInNoirFormat
    ]);
    expect(account[OFFSETS.NONCE]).toStrictEqual('0x02cb');
    expect(account[OFFSETS.BALANCE]).toStrictEqual('0x019c54c1cc8b1ad5994d');

    const proofInputKeyPart = account[OFFSETS.PROOF_INPUT].slice(0, accountProofConfig.maxPrefixedKeyNibbleLen);
    expect(proofInputKeyPart).toMatchSnapshot();
    const proofInputValuePart = account[OFFSETS.PROOF_INPUT].slice(
      accountProofConfig.maxPrefixedKeyNibbleLen,
      accountProofConfig.maxPrefixedKeyNibbleLen + accountProofConfig.maxValueLen
    );
    expect(proofInputValuePart).toMatchSnapshot();
    const proofInputDepthPart = account[OFFSETS.PROOF_INPUT][account[OFFSETS.PROOF_INPUT].length - 1];
    expect(proofInputDepthPart).toStrictEqual('0x09');
  });
});
