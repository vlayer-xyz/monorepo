"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventSignature = void 0;
const getFunctionSignature_js_1 = require("./getFunctionSignature.js");
const getEventSignature = (fn) => {
    return (0, getFunctionSignature_js_1.getFunctionSignature)(fn);
};
exports.getEventSignature = getEventSignature;
//# sourceMappingURL=getEventSignature.js.map