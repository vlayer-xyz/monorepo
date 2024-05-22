// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

error InvalidBlockHash(uint256 blockNo, bytes32 blockHash);
error BlockTooOld(uint256 blockNo);
error BlockInTheFuture(uint256 blockNo);

contract EthereumHistoryVerifier {
    function verify(uint blockNo, bytes32 blockHash) public view {
        if (blockNo >= block.number) {
            revert BlockInTheFuture(blockNo);
        }
        if (blockhash(blockNo) != blockHash) {
            revert InvalidBlockHash(blockNo, blockHash);
        }
        if (blockhash(blockNo) == bytes32(0)) {
            revert BlockTooOld(blockNo);
        }
    }
}
