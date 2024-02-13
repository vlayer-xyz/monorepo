import { describe, expect, it } from 'vitest';
import { encodeHexString, decodeHexString } from './encode.js';
describe('encodeHexString', () => {
    it('throws on invalid input', () => {
        expect(() => encodeHexString('1234')).toThrow('Invalid hexstring: 1234');
    });
    it('encodes hex string', () => {
        expect(encodeHexString('0x1234')).toStrictEqual(new Uint8Array([0x12, 0x34]));
    });
});
describe('decodeHexString', () => {
    it('decodes hex string', () => {
        expect(decodeHexString(new Uint8Array([0x12, 0x34]))).toStrictEqual('0x1234');
    });
});
