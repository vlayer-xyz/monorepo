import type { ErrorType } from '../../errors/utils.js';
import type { Block, BlockTag } from '../../types/block.js';
import type { Chain } from '../../types/chain.js';
import type { ExtractChainFormatterExclude, ExtractChainFormatterReturnType } from '../../types/chain.js';
import type { Hash } from '../../types/misc.js';
import type { RpcBlock } from '../../types/rpc.js';
import type { Prettify } from '../../types/utils.js';
import { type DefineFormatterErrorType } from './formatter.js';
import { type FormattedTransaction } from './transaction.js';
type BlockPendingDependencies = 'hash' | 'logsBloom' | 'nonce' | 'number';
export type FormattedBlock<TChain extends {
    formatters?: Chain['formatters'];
} | undefined = {
    formatters?: Chain['formatters'];
} | undefined, TIncludeTransactions extends boolean = boolean, TBlockTag extends BlockTag = BlockTag, _FormatterReturnType = ExtractChainFormatterReturnType<TChain, 'block', Block<bigint, TIncludeTransactions>>, _ExcludedPendingDependencies extends string = BlockPendingDependencies & ExtractChainFormatterExclude<TChain, 'block'>, _Formatted = Omit<_FormatterReturnType, BlockPendingDependencies> & {
    [_key in _ExcludedPendingDependencies]: never;
} & Pick<Block<bigint, TIncludeTransactions, TBlockTag>, BlockPendingDependencies>, _Transactions = TIncludeTransactions extends true ? Prettify<FormattedTransaction<TChain, TBlockTag>>[] : Hash[]> = Omit<_Formatted, 'transactions'> & {
    transactions: _Transactions;
};
export type FormatBlockErrorType = ErrorType;
export declare function formatBlock(block: Partial<RpcBlock>): Block;
export type DefineBlockErrorType = DefineFormatterErrorType | ErrorType;
export declare const defineBlock: <TOverrideParameters, TOverrideReturnType, TExclude extends (keyof RpcBlock | keyof TOverrideParameters)[] = []>({ exclude, format: overrides, }: {
    exclude?: TExclude | undefined;
    format: (_: TOverrideParameters) => TOverrideReturnType;
}) => {
    exclude: TExclude | undefined;
    format: (args: import("../../types/utils.js").Assign<Partial<RpcBlock>, TOverrideParameters>) => (import("../../types/utils.js").Assign<Block, TOverrideReturnType> extends infer T ? { [K in keyof T]: import("../../types/utils.js").Assign<Block, TOverrideReturnType>[K]; } : never) & { [_key in TExclude[number]]: never; };
    type: "block";
};
export {};
//# sourceMappingURL=block.d.ts.map