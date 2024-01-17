import { stringify } from './json-bigint.js';

export const equals = (a: object | string | number, b: object | string | number): boolean =>
  stringify(a) === stringify(b);
