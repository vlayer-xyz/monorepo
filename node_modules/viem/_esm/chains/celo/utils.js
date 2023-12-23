import { trim } from '../../utils/data/trim.js';
export function isEmpty(value) {
    return (value === 0 ||
        value === 0n ||
        value === undefined ||
        value === null ||
        value === '0' ||
        value === '' ||
        (typeof value === 'string' &&
            (trim(value).toLowerCase() === '0x' ||
                trim(value).toLowerCase() === '0x00')));
}
export function isPresent(value) {
    return !isEmpty(value);
}
export function isEIP1559(transaction) {
    return (isPresent(transaction.maxFeePerGas) &&
        isPresent(transaction.maxPriorityFeePerGas));
}
// process as CIP42 if any of these fields are present. realistically gatewayfee is not used but is part of spec
export function isCIP42(transaction) {
    // Enable end-user to force the tx to be considered as a cip42
    if (transaction.type === 'cip42') {
        return true;
    }
    return (isEIP1559(transaction) &&
        (isPresent(transaction.feeCurrency) ||
            isPresent(transaction.gatewayFeeRecipient) ||
            isPresent(transaction.gatewayFee)));
}
export function isCIP64(transaction) {
    /*
     * Enable end user to force the tx to be considered as a CIP-64.
     *
     * The preliminary type will be determined as "eip1559" by src/utils/transaction/getTransactionType.ts
     * and so we need the logic below to check for the specific value instead of checking if just any
     * transaction type is provided. If that's anything else than "cip64" then we need to reevaluate the
     * type based on the transaction fields.
     *
     * Modify with caution and according to https://github.com/celo-org/celo-proposals/blob/master/CIPs/cip-0064.md
     */
    if (transaction.type === 'cip64') {
        return true;
    }
    return (isEIP1559(transaction) &&
        isPresent(transaction.feeCurrency) &&
        isEmpty(transaction.gatewayFee) &&
        isEmpty(transaction.gatewayFeeRecipient));
}
//# sourceMappingURL=utils.js.map