import type { ErrorType } from '../errors/utils.js';
import { type HDKeyToAccountErrorType } from './hdKeyToAccount.js';
import type { HDAccount, HDOptions } from './types.js';
export type MnemonicToAccountErrorType = HDKeyToAccountErrorType | ErrorType;
/**
 * @description Creates an Account from a mnemonic phrase.
 *
 * @returns A HD Account.
 */
export declare function mnemonicToAccount(mnemonic: string, opts?: HDOptions): HDAccount;
//# sourceMappingURL=mnemonicToAccount.d.ts.map