// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from 'forge-std/Test.sol';
import {EthereumHistoryVerifier, InvalidBlockHash, BlockTooOld, BlockInTheFuture} from '../src/EthereumHistoryVerifier.sol';

contract EthereumHistoryVerifierTest is Test {
    EthereumHistoryVerifier public verifier;

    function setUp() public {
        verifier = new EthereumHistoryVerifier();
        vm.roll(1024);
    }

    function test_correct_block() public view {
        uint blockNo = block.number - 1;
        bytes32 blockHash = blockhash(blockNo);
        verifier.verify(blockNo, blockHash);
    }

    function test_RevertWhenInvalidHash() public {
        uint blockNo = block.number - 1;
        bytes32 blockHash = blockhash(blockNo - 1);

        vm.expectRevert(abi.encodeWithSelector(InvalidBlockHash.selector, blockNo, blockHash));
        verifier.verify(blockNo, blockHash);
    }

    function test_RevertIfCurrentBlock() public {
        uint blockNo = block.number;
        bytes32 blockHash = blockhash(blockNo);

        vm.expectRevert(abi.encodeWithSelector(BlockInTheFuture.selector, blockNo));
        verifier.verify(blockNo, blockHash);
    }

    function test_RevertIfFutureBlock() public {
        uint blockNo = block.number + 1;
        bytes32 blockHash = blockhash(blockNo);

        vm.expectRevert(abi.encodeWithSelector(BlockInTheFuture.selector, blockNo));
        verifier.verify(blockNo, blockHash);
    }

    function test_RevertIfBlockTooOld() public {
        uint blockNo = block.number - 257;
        bytes32 blockHash = blockhash(blockNo);

        vm.expectRevert(abi.encodeWithSelector(BlockTooOld.selector, blockNo));
        verifier.verify(blockNo, blockHash);
    }

    function test_BlockJustOldEnough() public view {
        uint blockNo = block.number - 256;
        bytes32 blockHash = blockhash(blockNo);

        verifier.verify(blockNo, blockHash);
    }
}
