// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {UltraVerifier} from "../src/generated-verifier/UltraVerifier.sol";


contract EthereumHistoryVerifierTest is Test {
    UltraVerifier public verifier;

    function setUp() public {
        verifier = new UltraVerifier();
        vm.roll(1024);
    }

    function test_CorrectProof() public view {
        string memory proofString = vm.readLine("./test/fixtures/example.proof");
        bytes memory proof = vm.parseBytes(proofString);

        uint publicInputsLength = 4498;
        bytes32[] memory publicInputs = new bytes32[](publicInputsLength);
        for (uint i = 0; i < publicInputsLength; i++) {
            string memory publicInputString = vm.readLine("./test/fixtures/example.publicInputs");
            bytes32 publicInput = vm.parseBytes32(publicInputString);
            publicInputs[i] = publicInput;
        }

        verifier.verify(proof, publicInputs);
    }

}