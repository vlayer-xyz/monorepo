import { assert } from './assert.js';
import { incHexByte } from './string.js';
export function padArray(array, len, pad, direction = 'right') {
    assert(len >= array.length, `len param: ${len} should be greater than array length: ${array.length}`);
    const padding = new Array(len - array.length).fill(pad);
    switch (direction) {
        case 'left':
            return padding.concat(array);
        case 'right':
            return array.concat(padding);
    }
}
export const alterArray = function (array) {
    assert(array.length > 0, 'Array should not be empty');
    return [incHexByte(array[0]), ...array.slice(1)];
};
