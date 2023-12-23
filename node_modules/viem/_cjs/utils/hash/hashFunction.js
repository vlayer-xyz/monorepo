"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashAbiItem = exports.hashFunction = void 0;
const formatAbiItem_js_1 = require("../abi/formatAbiItem.js");
const toBytes_js_1 = require("../encoding/toBytes.js");
const getFunctionSignature_js_1 = require("./getFunctionSignature.js");
const keccak256_js_1 = require("./keccak256.js");
const hash = (value) => (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value));
function hashFunction(def) {
    return hash((0, getFunctionSignature_js_1.getFunctionSignature)(def));
}
exports.hashFunction = hashFunction;
function hashAbiItem(abiItem) {
    return hash((0, formatAbiItem_js_1.formatAbiItem)(abiItem));
}
exports.hashAbiItem = hashAbiItem;
//# sourceMappingURL=hashFunction.js.map