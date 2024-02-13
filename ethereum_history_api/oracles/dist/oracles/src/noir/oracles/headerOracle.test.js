import { describe, expect, it } from 'vitest';
import { parseNoirGetHeaderArguments } from './headerOracle.js';
describe('headerOracle', () => {
    it('parseNoirGetHeaderArguments success', () => {
        expect(parseNoirGetHeaderArguments([['0x0']])).toEqual(0n);
        expect(parseNoirGetHeaderArguments([['0xff']])).toEqual(255n);
    });
    it('parseNoirGetHeaderArguments fail', () => {
        expect(() => parseNoirGetHeaderArguments([])).toThrow('get_header requires 1 argument');
        expect(() => parseNoirGetHeaderArguments([[], []])).toThrow('get_header requires 1 argument');
        expect(() => parseNoirGetHeaderArguments([[]])).toThrow('get_account first argument must be an array of length 1');
        expect(() => parseNoirGetHeaderArguments([['1']])).toThrow('get_account first argument must be a hex value');
    });
});
