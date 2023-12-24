import { ReturnTypeBlockHeader, createPublicClient, http, keccak256, numberToHex, toRlp } from 'viem';
import { mainnet } from 'viem/chains';


export function encodeBlockHeader(blockHeader: ReturnTypeBlockHeader) {
  let header = [
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
  ];
  if (blockHeader.baseFeePerGas) {
    header.push(blockHeader.baseFeePerGas);
  }
  return toRlp(header);
}
