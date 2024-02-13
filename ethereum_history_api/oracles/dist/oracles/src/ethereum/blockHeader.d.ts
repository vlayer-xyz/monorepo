import { type GetBlockReturnType, type Hex } from 'viem';
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
}
export declare function headerToRlp(blockHeader: BlockHeader): Hex;
export declare function toHexString(arg: number | bigint): Hex;
export declare function blockToHeader(block: GetBlockReturnType): BlockHeader;
export declare function calculateBlockHeaderHash(blockHeader: BlockHeader): Hex;
export declare function calculateBlockHash(block: GetBlockReturnType): Hex;
