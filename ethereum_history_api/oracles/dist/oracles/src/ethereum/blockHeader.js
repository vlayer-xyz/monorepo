import { hexToBytes, hexToRlp, keccak256 } from 'viem';
export function headerToRlp(blockHeader) {
    const header = [
        blockHeader.parentHash,
        blockHeader.sha3Uncles,
        blockHeader.miner,
        blockHeader.stateRoot,
        blockHeader.transactionsRoot,
        blockHeader.receiptsRoot,
        blockHeader.logsBloom,
        blockHeader.difficulty === '0x0' ? '0x' : blockHeader.difficulty,
        blockHeader.number,
        blockHeader.gasLimit,
        blockHeader.gasUsed === '0x0' ? '0x' : blockHeader.gasUsed,
        blockHeader.timestamp,
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
    return hexToRlp(header);
}
export function toHexString(arg) {
    return `0x${arg.toString(16)}`;
}
export function blockToHeader(block) {
    const blockHeader = {
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
        withdrawalsRoot: block.withdrawalsRoot !== null ? block.withdrawalsRoot : undefined
    };
    return blockHeader;
}
export function calculateBlockHeaderHash(blockHeader) {
    return keccak256(hexToBytes(headerToRlp(blockHeader)));
}
export function calculateBlockHash(block) {
    return calculateBlockHeaderHash(blockToHeader(block));
}
