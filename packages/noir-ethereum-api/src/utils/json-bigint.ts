// eslint-disable-next-line no-restricted-imports
import JSONBigInt from 'json-bigint';

export const { stringify, parse } = JSONBigInt({ useNativeBigInt: true });
