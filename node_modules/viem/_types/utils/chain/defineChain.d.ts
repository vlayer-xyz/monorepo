import type { Chain, ChainConfig, ChainFormatters } from '../../types/chain.js';
import type { Assign } from '../../types/utils.js';
export declare function defineChain<const chain extends Chain, formatters extends ChainFormatters | undefined = undefined>(chain: chain, config?: ChainConfig<formatters>): Assign<chain, ChainConfig<formatters>>;
//# sourceMappingURL=defineChain.d.ts.map