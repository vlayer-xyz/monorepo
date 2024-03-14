import { type GetBlockReturnType, type Hex, hexToBytes, hexToRlp, keccak256 } from 'viem';

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
  withdrawalsRoot?: Hex;
  blobGasUsed?: Hex;
  excessBlobGas?: Hex;
  parentBeaconBlockRoot?: Hex;
}

function unpadded(hex: Hex) {
  return hex === '0x0' ? '0x' : hex;
}

export function headerToRlpFields(blockHeader: BlockHeader): Hex[] {
  const header: Hex[] = [
    blockHeader.parentHash,
    blockHeader.sha3Uncles,
    blockHeader.miner,
    blockHeader.stateRoot,
    blockHeader.transactionsRoot,
    blockHeader.receiptsRoot,
    blockHeader.logsBloom,
    unpadded(blockHeader.difficulty),
    unpadded(blockHeader.number),
    unpadded(blockHeader.gasLimit),
    unpadded(blockHeader.gasUsed),
    unpadded(blockHeader.timestamp),
    blockHeader.extraData,
    blockHeader.mixHash,
    blockHeader.nonce
  ];
  if (blockHeader.baseFeePerGas !== undefined) {
    header.push(blockHeader.baseFeePerGas);
  }
  if (blockHeader.withdrawalsRoot !== undefined) {
    header.push(blockHeader.withdrawalsRoot);
  }
  if (blockHeader.blobGasUsed !== undefined) {
    header.push(unpadded(blockHeader.blobGasUsed));
  }
  if (blockHeader.excessBlobGas !== undefined) {
    header.push(unpadded(blockHeader.excessBlobGas));
  }
  if (blockHeader.parentBeaconBlockRoot !== undefined) {
    header.push(blockHeader.parentBeaconBlockRoot);
  }
  return header;
}

export function headerToRlp(blockHeader: BlockHeader): Hex {
  const header = headerToRlpFields(blockHeader);
  return hexToRlp(header);
}

export function toHexString(arg: number | bigint): Hex {
  return `0x${arg.toString(16)}`;
}

/* Can be removed after Dencun hardfork */
export type Block = GetBlockReturnType & {
  blobGasUsed?: bigint;
  excessBlobGas?: bigint;
  parentBeaconBlockRoot?: Hex;
};

export function blockToHeader(block: Block): BlockHeader {
  const blockHeader: BlockHeader = {
    parentHash: block.parentHash,
    sha3Uncles: block.sha3Uncles,
    miner: block.miner,
    stateRoot: block.stateRoot,
    transactionsRoot: block.transactionsRoot,
    receiptsRoot: block.receiptsRoot,
    logsBloom: block.logsBloom,
    difficulty: toHexString(block.difficulty),
    number: toHexString(block.number),
    gasLimit: toHexString(block.gasLimit),
    gasUsed: toHexString(block.gasUsed),
    timestamp: toHexString(block.timestamp),
    extraData: block.extraData,
    mixHash: block.mixHash,
    nonce: block.nonce,
    baseFeePerGas: block.baseFeePerGas !== null ? toHexString(block.baseFeePerGas) : undefined,
    withdrawalsRoot: block.withdrawalsRoot !== null ? block.withdrawalsRoot : undefined,
    blobGasUsed: block.blobGasUsed !== undefined ? toHexString(block.blobGasUsed) : undefined,
    excessBlobGas: block.excessBlobGas !== undefined ? toHexString(block.excessBlobGas) : undefined,
    parentBeaconBlockRoot: block.parentBeaconBlockRoot ?? undefined
  };
  return blockHeader;
}

export function calculateBlockHeaderHash(blockHeader: BlockHeader): Hex {
  return keccak256(hexToBytes(headerToRlp(blockHeader)));
}

export function calculateBlockHash(block: Block): Hex {
  return calculateBlockHeaderHash(blockToHeader(block));
}
