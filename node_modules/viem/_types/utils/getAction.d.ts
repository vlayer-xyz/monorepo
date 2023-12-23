import type { Client } from '../clients/createClient.js';
/**
 * Retrieves and returns an action from the client (if exists), and falls
 * back to the tree-shakable action.
 *
 * Useful for extracting overridden actions from a client (ie. if a consumer
 * wants to override the `sendTransaction` implementation).
 */
export declare function getAction<params extends {}, returnType extends {}>(client: Client, action: (_: any, params: params) => returnType, name: string): (params: params) => returnType;
//# sourceMappingURL=getAction.d.ts.map