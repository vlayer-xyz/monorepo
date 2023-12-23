"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventSelector = void 0;
const toBytes_js_1 = require("../encoding/toBytes.js");
const getEventSignature_js_1 = require("./getEventSignature.js");
const keccak256_js_1 = require("./keccak256.js");
const hash = (value) => (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value));
const getEventSelector = (fn) => hash((0, getEventSignature_js_1.getEventSignature)(fn));
exports.getEventSelector = getEventSelector;
//# sourceMappingURL=getEventSelector.js.map