// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

error InvalidBlockHash(uint256 blockNo, bytes32 blockHash);
error InvalidBlockNumber(uint256 blockNo);

contract EthereumHistoryVerifier {

    function verify(uint blockNo, bytes32 blockHash) view public {
        if (blockhash(blockNo) != blockHash) {
            revert InvalidBlockHash(blockNo, blockHash);
        }
        if (blockhash(blockNo) == bytes32(0)) {
            revert InvalidBlockNumber(blockNo);
        }
    }

}
