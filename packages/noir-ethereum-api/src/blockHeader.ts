import { ReturnTypeBlockHeader, toRlp, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';


export function encodeBlockHeader(blockHeader: ReturnTypeBlockHeader) {
  const encodedHeader = toRlp([
    blockHeader.parentHash,
    blockHeader.sha3Uncles,
    blockHeader.miner,
    blockHeader.stateRoot,
    blockHeader.transactionsRoot,
    blockHeader.receiptsRoot,
    blockHeader.logsBloom,
    blockHeader.difficulty,
    blockHeader.number,
    blockHeader.gasLimit,
    blockHeader.gasUsed,
    blockHeader.timestamp,
    blockHeader.extraData,
    blockHeader.mixHash,
    blockHeader.nonce
  ]);
  return encodedHeader;
}
