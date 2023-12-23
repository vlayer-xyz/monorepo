"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionSelector = void 0;
const slice_js_1 = require("../data/slice.js");
const toBytes_js_1 = require("../encoding/toBytes.js");
const getFunctionSignature_js_1 = require("./getFunctionSignature.js");
const keccak256_js_1 = require("./keccak256.js");
const hash = (value) => (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value));
const getFunctionSelector = (fn) => (0, slice_js_1.slice)(hash((0, getFunctionSignature_js_1.getFunctionSignature)(fn)), 0, 4);
exports.getFunctionSelector = getFunctionSelector;
//# sourceMappingURL=getFunctionSelector.js.map