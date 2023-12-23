"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionSignature = void 0;
const abitype_1 = require("abitype");
const normalizeSignature_js_1 = require("./normalizeSignature.js");
const getFunctionSignature = (fn_) => {
    const fn = (() => {
        if (typeof fn_ === 'string')
            return fn_;
        return (0, abitype_1.formatAbiItem)(fn_);
    })();
    return (0, normalizeSignature_js_1.normalizeSignature)(fn);
};
exports.getFunctionSignature = getFunctionSignature;
//# sourceMappingURL=getFunctionSignature.js.map