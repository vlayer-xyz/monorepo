"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCIP64 = exports.isCIP42 = exports.isEIP1559 = exports.isPresent = exports.isEmpty = void 0;
const trim_js_1 = require("../../utils/data/trim.js");
function isEmpty(value) {
    return (value === 0 ||
        value === 0n ||
        value === undefined ||
        value === null ||
        value === '0' ||
        value === '' ||
        (typeof value === 'string' &&
            ((0, trim_js_1.trim)(value).toLowerCase() === '0x' ||
                (0, trim_js_1.trim)(value).toLowerCase() === '0x00')));
}
exports.isEmpty = isEmpty;
function isPresent(value) {
    return !isEmpty(value);
}
exports.isPresent = isPresent;
function isEIP1559(transaction) {
    return (isPresent(transaction.maxFeePerGas) &&
        isPresent(transaction.maxPriorityFeePerGas));
}
exports.isEIP1559 = isEIP1559;
function isCIP42(transaction) {
    if (transaction.type === 'cip42') {
        return true;
    }
    return (isEIP1559(transaction) &&
        (isPresent(transaction.feeCurrency) ||
            isPresent(transaction.gatewayFeeRecipient) ||
            isPresent(transaction.gatewayFee)));
}
exports.isCIP42 = isCIP42;
function isCIP64(transaction) {
    if (transaction.type === 'cip64') {
        return true;
    }
    return (isEIP1559(transaction) &&
        isPresent(transaction.feeCurrency) &&
        isEmpty(transaction.gatewayFee) &&
        isEmpty(transaction.gatewayFeeRecipient));
}
exports.isCIP64 = isCIP64;
//# sourceMappingURL=utils.js.map