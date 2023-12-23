import { InvalidAddressError } from '../../errors/address.js';
import { BaseError } from '../../errors/base.js';
import { InvalidChainIdError } from '../../errors/chain.js';
import { isAddress } from '../../utils/address/isAddress.js';
import { concatHex } from '../../utils/data/concat.js';
import { toHex } from '../../utils/encoding/toHex.js';
import { toRlp } from '../../utils/encoding/toRlp.js';
import { serializeTransaction, } from '../../utils/transaction/serializeTransaction.js';
export const serializeTransactionZkSync = (tx, signature) => {
    if (isEIP712(tx))
        return serializeTransactionZkSyncEIP712(tx);
    return serializeTransaction(tx, signature);
};
export const serializersZkSync = {
    transaction: serializeTransactionZkSync,
};
function serializeTransactionZkSyncEIP712(transaction) {
    const { chainId, gas, nonce, to, from, value, maxFeePerGas, maxPriorityFeePerGas, customSignature, factoryDeps, paymaster, paymasterInput, gasPerPubdata, data, } = transaction;
    assertTransactionEIP712(transaction);
    const serializedTransaction = [
        nonce ? toHex(nonce) : '0x',
        maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
        maxFeePerGas ? toHex(maxFeePerGas) : '0x',
        gas ? toHex(gas) : '0x',
        to ?? '0x',
        value ? toHex(value) : '0x',
        data ?? '0x',
        toHex(chainId),
        toHex(''),
        toHex(''),
        toHex(chainId),
        from ?? '0x',
        gasPerPubdata ? toHex(gasPerPubdata) : '0x',
        factoryDeps ?? [],
        customSignature ?? '0x',
        paymaster && paymasterInput ? [paymaster, paymasterInput] : [],
    ];
    return concatHex([
        '0x71',
        toRlp(serializedTransaction),
    ]);
}
//////////////////////////////////////////////////////////////////////////////
// Utilities
function isEIP712(transaction) {
    if ('customSignature' in transaction ||
        'paymaster' in transaction ||
        'paymasterInput' in transaction ||
        'gasPerPubdata' in transaction ||
        'factoryDeps' in transaction)
        return true;
    return false;
}
export function assertTransactionEIP712(transaction) {
    const { chainId, to, from, paymaster, paymasterInput } = transaction;
    if (chainId <= 0)
        throw new InvalidChainIdError({ chainId });
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
    if (from && !isAddress(from))
        throw new InvalidAddressError({ address: from });
    if (paymaster && !isAddress(paymaster))
        throw new InvalidAddressError({ address: paymaster });
    if (paymaster && !paymasterInput) {
        throw new BaseError('`paymasterInput` must be provided when `paymaster` is defined');
    }
    if (!paymaster && paymasterInput) {
        throw new BaseError('`paymaster` must be provided when `paymasterInput` is defined');
    }
}
//# sourceMappingURL=serializers.js.map