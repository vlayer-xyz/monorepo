"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCode = void 0;
const tslib_1 = require("tslib");
const barretenberg_wasm_1 = tslib_1.__importDefault(require("../../barretenberg.wasm"));
const barretenberg_threads_wasm_1 = tslib_1.__importDefault(require("../../barretenberg-threads.wasm"));
// Annoyingly the wasm declares if it's memory is shared or not. So now we need two wasms if we want to be
// able to fallback on "non shared memory" situations.
async function fetchCode(multithreaded) {
    const res = await fetch(multithreaded ? barretenberg_threads_wasm_1.default : barretenberg_wasm_1.default);
    return await res.arrayBuffer();
}
exports.fetchCode = fetchCode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYmFycmV0ZW5iZXJnX3dhc20vZmV0Y2hfY29kZS9icm93c2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSx3RkFBeUQ7QUFDekQsd0dBQXdFO0FBRXhFLDBHQUEwRztBQUMxRyxzREFBc0Q7QUFDL0MsS0FBSyxVQUFVLFNBQVMsQ0FBQyxhQUFzQjtJQUNwRCxNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLG1DQUF5QixDQUFDLENBQUMsQ0FBQywyQkFBa0IsQ0FBQyxDQUFDO0lBQ3hGLE9BQU8sTUFBTSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDakMsQ0FBQztBQUhELDhCQUdDIn0=