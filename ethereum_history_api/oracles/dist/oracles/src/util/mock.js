export function mock(methodFilter, methodHandler) {
    const handler = {
        get(target, prop, receiver) {
            if (methodFilter(prop)) {
                return (...args) => methodHandler(prop, args);
            }
            else {
                return Reflect.get(target, prop, receiver);
            }
        }
    };
    return new Proxy({}, handler);
}
