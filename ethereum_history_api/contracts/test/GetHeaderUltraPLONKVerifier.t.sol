// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {UltraVerifier as GetHeaderUltraPLONKVerifier} from "../src/generated-verifier/GetHeaderUltraPLONKVerifier.sol";


contract GetHeaderUltraPLONKVerifierTest is Test {
    GetHeaderUltraPLONKVerifier public verifier;

    function setUp() public {
        verifier = new GetHeaderUltraPLONKVerifier();
        vm.roll(1024);
    }

    function test_CorrectGetHeaderProof() public view {
        string memory proofString = vm.readLine("./test/fixtures/get_header.proof");
        bytes memory proof = vm.parseBytes(proofString);


        uint numberOfPublicArgValues = 1;
        uint numberOfPublicReturnValues = 1 + 32 + 32 + 32 + 32;
        uint numberOfPublicInputs = numberOfPublicArgValues + numberOfPublicReturnValues;
        bytes32[] memory publicInputs = this.loadPublicInputs("get_header", numberOfPublicInputs);

        verifier.verify(proof, publicInputs);
    }

    function loadPublicInputs(string memory fixtureName, uint length) public view returns (bytes32[] memory) {
        bytes32[] memory publicInputs = new bytes32[](length);
        for (uint i = 0; i < length; i++) {
            string memory fileName = string.concat("./test/fixtures/", fixtureName, ".publicInputs");
            string memory publicInputString = vm.readLine(fileName);
            bytes32 publicInput = vm.parseBytes32(publicInputString);
            publicInputs[i] = publicInput;
        }
        return publicInputs;
    }

}