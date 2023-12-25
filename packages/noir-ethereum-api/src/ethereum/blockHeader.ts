import { keccak256, hexToRlp, Hex, hexToBytes, GetBlockReturnType } from 'viem';
import { encodeField } from '../noir/encode.js';

export interface BlockHeader {
  parentHash: Hex;
  sha3Uncles: Hex;
  miner: Hex;
  stateRoot: Hex;
  transactionsRoot: Hex;
  receiptsRoot: Hex;
  logsBloom: Hex;
  difficulty: Hex;
  number: Hex;
  gasLimit: Hex;
  gasUsed: Hex;
  timestamp: Hex;
  extraData: Hex;
  mixHash: Hex;
  nonce: Hex;
  baseFeePerGas?: Hex;
}


export function encodeBlockHeader(blockHeader: BlockHeader) {
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
  return hexToRlp(header);
}

export function blockToHeader(block: GetBlockReturnType) {
  return {
    parentHash: block.parentHash,
    sha3Uncles: block.sha3Uncles,
    miner: block.miner,
    stateRoot: block.stateRoot,
    transactionsRoot: block.transactionsRoot,
    receiptsRoot: block.receiptsRoot,
    logsBloom: block.logsBloom,
    difficulty: encodeField(block.difficulty),
    number: encodeField(block.number),
    gasLimit: encodeField(block.gasLimit),
    gasUsed: encodeField(block.gasUsed),
    timestamp: encodeField(block.timestamp),
    extraData: block.extraData,
    mixHash: block.mixHash,
    nonce: block.nonce
  };
}


export function calculateBlockHeaderHash(blockHeader: BlockHeader) : Hex {
  return keccak256(hexToBytes(encodeBlockHeader(blockHeader)));
}
