"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionConfirmations = void 0;
const getAction_js_1 = require("../../utils/getAction.js");
const getBlockNumber_js_1 = require("./getBlockNumber.js");
const getTransaction_js_1 = require("./getTransaction.js");
async function getTransactionConfirmations(client, { hash, transactionReceipt }) {
    const [blockNumber, transaction] = await Promise.all([
        (0, getAction_js_1.getAction)(client, getBlockNumber_js_1.getBlockNumber, 'getBlockNumber')({}),
        hash
            ? (0, getAction_js_1.getAction)(client, getTransaction_js_1.getTransaction, 'getBlockNumber')({ hash })
            : undefined,
    ]);
    const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
    if (!transactionBlockNumber)
        return 0n;
    return blockNumber - transactionBlockNumber + 1n;
}
exports.getTransactionConfirmations = getTransactionConfirmations;
//# sourceMappingURL=getTransactionConfirmations.js.map