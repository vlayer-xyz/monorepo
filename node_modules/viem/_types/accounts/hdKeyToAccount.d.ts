import type { HDKey } from '@scure/bip32';
import { type ToHexErrorType } from '../utils/encoding/toHex.js';
import type { ErrorType } from '../errors/utils.js';
import { type PrivateKeyToAccountErrorType } from './privateKeyToAccount.js';
import type { HDAccount, HDOptions } from './types.js';
export type HDKeyToAccountErrorType = PrivateKeyToAccountErrorType | ToHexErrorType | ErrorType;
/**
 * @description Creates an Account from a HD Key.
 *
 * @returns A HD Account.
 */
export declare function hdKeyToAccount(hdKey_: HDKey, { accountIndex, addressIndex, changeIndex, path }?: HDOptions): HDAccount;
//# sourceMappingURL=hdKeyToAccount.d.ts.map