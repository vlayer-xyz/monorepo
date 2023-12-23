"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattersCelo = void 0;
const fromHex_js_1 = require("../../utils/encoding/fromHex.js");
const toHex_js_1 = require("../../utils/encoding/toHex.js");
const block_js_1 = require("../../utils/formatters/block.js");
const transaction_js_1 = require("../../utils/formatters/transaction.js");
const transactionReceipt_js_1 = require("../../utils/formatters/transactionReceipt.js");
const transactionRequest_js_1 = require("../../utils/formatters/transactionRequest.js");
const utils_js_1 = require("./utils.js");
exports.formattersCelo = {
    block: (0, block_js_1.defineBlock)({
        exclude: ['difficulty', 'gasLimit', 'mixHash', 'nonce', 'uncles'],
        format(args) {
            const transactions = args.transactions?.map((transaction) => {
                if (typeof transaction === 'string')
                    return transaction;
                return {
                    ...(0, transaction_js_1.formatTransaction)(transaction),
                    feeCurrency: transaction.feeCurrency,
                    ...(transaction.type !== '0x7b'
                        ? {
                            gatewayFee: transaction.gatewayFee
                                ? (0, fromHex_js_1.hexToBigInt)(transaction.gatewayFee)
                                : null,
                            gatewayFeeRecipient: transaction.gatewayFeeRecipient || null,
                        }
                        : {}),
                };
            });
            return {
                randomness: args.randomness,
                transactions,
            };
        },
    }),
    transaction: (0, transaction_js_1.defineTransaction)({
        format(args) {
            const transaction = { feeCurrency: args.feeCurrency };
            if (args.type === '0x7b')
                transaction.type = 'cip64';
            else {
                if (args.type === '0x7c')
                    transaction.type = 'cip42';
                transaction.gatewayFee = args.gatewayFee
                    ? (0, fromHex_js_1.hexToBigInt)(args.gatewayFee)
                    : null;
                transaction.gatewayFeeRecipient = args.gatewayFeeRecipient;
            }
            return transaction;
        },
    }),
    transactionReceipt: (0, transactionReceipt_js_1.defineTransactionReceipt)({
        format(args) {
            return {
                feeCurrency: args.feeCurrency,
                gatewayFee: args.gatewayFee ? (0, fromHex_js_1.hexToBigInt)(args.gatewayFee) : null,
                gatewayFeeRecipient: args.gatewayFeeRecipient,
            };
        },
    }),
    transactionRequest: (0, transactionRequest_js_1.defineTransactionRequest)({
        format(args) {
            const request = {
                feeCurrency: args.feeCurrency,
            };
            if ((0, utils_js_1.isCIP64)(args))
                request.type = '0x7b';
            else {
                if ((0, utils_js_1.isCIP42)(args))
                    request.type = '0x7c';
                request.gatewayFee =
                    typeof args.gatewayFee !== 'undefined'
                        ? (0, toHex_js_1.numberToHex)(args.gatewayFee)
                        : undefined;
                request.gatewayFeeRecipient = args.gatewayFeeRecipient;
            }
            return request;
        },
    }),
};
//# sourceMappingURL=formatters.js.map