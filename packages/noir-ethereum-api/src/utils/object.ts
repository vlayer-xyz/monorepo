import { stringify } from './json-bigint.js';

export const equals = (a: object, b: object): boolean => stringify(a) === stringify(b);
