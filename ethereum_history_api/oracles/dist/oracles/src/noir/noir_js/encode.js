import { isHex } from 'viem';
// ENCODERS
export function encodeHexString(value) {
    if (!isHex(value)) {
        throw new Error(`Invalid hexstring: ${value}`);
    }
    const arr = [];
    for (let i = 2; i < value.length; i += 2) {
        arr.push(parseInt(value.substr(i, 2), 16));
    }
    return new Uint8Array(arr);
}
// DECODERS
export function decodeHexString(proof) {
    return ('0x' +
        Array.from(proof)
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join(''));
}
