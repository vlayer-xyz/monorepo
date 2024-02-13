import { fromRlp, isHex } from 'viem';
import { assert } from '../../util/assert.js';
import { decodeField, decodeHexAddress, encodeField, encodeHex, encodeU120, encodeU64 } from './encode.js';
import { padArray } from '../../util/array.js';
const PROOF_ONE_LEVEL_LENGTH = 532;
const MAX_PROOF_LEVELS = 8;
const PROOF_LENGTH = PROOF_ONE_LEVEL_LENGTH * MAX_PROOF_LEVELS;
const MAX_ACCOUNT_STATE_LENGTH = 134;
const ZERO_PAD_VALUE = '0x0';
const RLP_VALUE_INDEX = 1;
export const getAccountOracle = async (client, args) => {
    const { blockNumber, address } = parseNoirGetAccountArguments(args);
    const accountProof = await client.getProof({
        address,
        storageKeys: [],
        blockNumber
    });
    const encodedAccount = encodeAccount(accountProof);
    const encodedProof = encodeStateProof(accountProof);
    return [...encodedAccount, ...encodedProof];
};
export function parseNoirGetAccountArguments(args) {
    assert(args.length === 2, 'get_account requires 2 arguments');
    const [noirBlockNumber, noirAddress] = args;
    assert(noirBlockNumber.length === 1, 'get_account first argument must be an array of length 1');
    assert(isHex(noirBlockNumber[0]), 'get_account first argument must be a hex value');
    assert(noirAddress.length === 20, 'get_account second argument must be an address');
    assert(noirAddress.every((it) => isHex(it)), 'get_account second argument must be an array of hex string values');
    const blockNumber = decodeField(noirBlockNumber[0]);
    const address = decodeHexAddress(noirAddress);
    return { blockNumber, address };
}
export function encodeAccount(ethProof) {
    const nonce = encodeU64(ethProof.nonce);
    const balance = encodeU120(ethProof.balance);
    const storageHash = encodeHex(ethProof.storageHash);
    const codeHash = encodeHex(ethProof.codeHash);
    return [nonce, balance, storageHash, codeHash];
}
export function encodeStateProof(ethProof) {
    const key = encodeHex(ethProof.address);
    const value = encodeValue(ethProof.accountProof);
    const proof = encodeProof(ethProof.accountProof);
    const depth = encodeField(ethProof.accountProof.length);
    return [key, value, proof, depth];
}
function encodeProof(proof) {
    const encodedUnpaddedProof = proof
        .map((it) => encodeHex(it))
        .map((it) => padArray(it, PROOF_ONE_LEVEL_LENGTH, ZERO_PAD_VALUE))
        .reduce((accumulator, current) => accumulator.concat(current), []);
    const encodedProof = padArray(encodedUnpaddedProof, PROOF_LENGTH, ZERO_PAD_VALUE);
    return encodedProof;
}
function encodeValue(proof) {
    const lastProofEntry = fromRlp(proof[proof.length - 1], 'hex');
    const value = lastProofEntry[RLP_VALUE_INDEX];
    assert(isHex(value), 'value should be of type Hex');
    return padArray(encodeHex(value), MAX_ACCOUNT_STATE_LENGTH, ZERO_PAD_VALUE, 'left');
}
