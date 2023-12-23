"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTransactionEIP712 = exports.serializersZkSync = exports.serializeTransactionZkSync = void 0;
const address_js_1 = require("../../errors/address.js");
const base_js_1 = require("../../errors/base.js");
const chain_js_1 = require("../../errors/chain.js");
const isAddress_js_1 = require("../../utils/address/isAddress.js");
const concat_js_1 = require("../../utils/data/concat.js");
const toHex_js_1 = require("../../utils/encoding/toHex.js");
const toRlp_js_1 = require("../../utils/encoding/toRlp.js");
const serializeTransaction_js_1 = require("../../utils/transaction/serializeTransaction.js");
const serializeTransactionZkSync = (tx, signature) => {
    if (isEIP712(tx))
        return serializeTransactionZkSyncEIP712(tx);
    return (0, serializeTransaction_js_1.serializeTransaction)(tx, signature);
};
exports.serializeTransactionZkSync = serializeTransactionZkSync;
exports.serializersZkSync = {
    transaction: exports.serializeTransactionZkSync,
};
function serializeTransactionZkSyncEIP712(transaction) {
    const { chainId, gas, nonce, to, from, value, maxFeePerGas, maxPriorityFeePerGas, customSignature, factoryDeps, paymaster, paymasterInput, gasPerPubdata, data, } = transaction;
    assertTransactionEIP712(transaction);
    const serializedTransaction = [
        nonce ? (0, toHex_js_1.toHex)(nonce) : '0x',
        maxPriorityFeePerGas ? (0, toHex_js_1.toHex)(maxPriorityFeePerGas) : '0x',
        maxFeePerGas ? (0, toHex_js_1.toHex)(maxFeePerGas) : '0x',
        gas ? (0, toHex_js_1.toHex)(gas) : '0x',
        to ?? '0x',
        value ? (0, toHex_js_1.toHex)(value) : '0x',
        data ?? '0x',
        (0, toHex_js_1.toHex)(chainId),
        (0, toHex_js_1.toHex)(''),
        (0, toHex_js_1.toHex)(''),
        (0, toHex_js_1.toHex)(chainId),
        from ?? '0x',
        gasPerPubdata ? (0, toHex_js_1.toHex)(gasPerPubdata) : '0x',
        factoryDeps ?? [],
        customSignature ?? '0x',
        paymaster && paymasterInput ? [paymaster, paymasterInput] : [],
    ];
    return (0, concat_js_1.concatHex)([
        '0x71',
        (0, toRlp_js_1.toRlp)(serializedTransaction),
    ]);
}
function isEIP712(transaction) {
    if ('customSignature' in transaction ||
        'paymaster' in transaction ||
        'paymasterInput' in transaction ||
        'gasPerPubdata' in transaction ||
        'factoryDeps' in transaction)
        return true;
    return false;
}
function assertTransactionEIP712(transaction) {
    const { chainId, to, from, paymaster, paymasterInput } = transaction;
    if (chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
    if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
    if (from && !(0, isAddress_js_1.isAddress)(from))
        throw new address_js_1.InvalidAddressError({ address: from });
    if (paymaster && !(0, isAddress_js_1.isAddress)(paymaster))
        throw new address_js_1.InvalidAddressError({ address: paymaster });
    if (paymaster && !paymasterInput) {
        throw new base_js_1.BaseError('`paymasterInput` must be provided when `paymaster` is defined');
    }
    if (!paymaster && paymasterInput) {
        throw new base_js_1.BaseError('`paymaster` must be provided when `paymasterInput` is defined');
    }
}
exports.assertTransactionEIP712 = assertTransactionEIP712;
//# sourceMappingURL=serializers.js.map