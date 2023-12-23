/**
 * Retrieves and returns an action from the client (if exists), and falls
 * back to the tree-shakable action.
 *
 * Useful for extracting overridden actions from a client (ie. if a consumer
 * wants to override the `sendTransaction` implementation).
 */
export function getAction(client, action, 
// Some minifiers drop `Function.prototype.name`, meaning that `action.name`
// will not work. For that case, the consumer needs to pass the name explicitly.
name) {
    return (params) => client[action.name || name]?.(params) ?? action(client, params);
}
//# sourceMappingURL=getAction.js.map