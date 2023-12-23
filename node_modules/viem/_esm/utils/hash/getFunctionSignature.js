import { formatAbiItem } from 'abitype';
import { normalizeSignature, } from './normalizeSignature.js';
export const getFunctionSignature = (fn_) => {
    const fn = (() => {
        if (typeof fn_ === 'string')
            return fn_;
        return formatAbiItem(fn_);
    })();
    return normalizeSignature(fn);
};
//# sourceMappingURL=getFunctionSignature.js.map