// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {EthereumHistoryVerifier, InvalidBlockHash} from "../src/EthereumHistoryVerifier.sol";

import "forge-std/console.sol";


contract EthereumHistoryVerifierTest is Test {
    EthereumHistoryVerifier public verifier;

    function setUp() public {
        verifier = new EthereumHistoryVerifier();
        vm.roll(1024);
    }

    function test_correct_block() public view {
        console.log("block.number", block.number);
        uint blockNo = block.number-1;
        bytes32 blockHash = blockhash(blockNo);
        verifier.verify(blockNo, blockHash);
    }

    function test_RevertWhenInvalidHash() public {
        console.log("block.number", block.number);
        uint blockNo = block.number-1;
        bytes32 blockHash = blockhash(blockNo-1);

        vm.expectRevert(abi.encodeWithSelector(InvalidBlockHash.selector, blockNo, blockHash));
        verifier.verify(blockNo, blockHash);
    }

}
