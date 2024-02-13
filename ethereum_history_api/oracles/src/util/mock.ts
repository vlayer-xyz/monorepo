export function mock<T extends object>(
  methodFilter: (method: string) => boolean,
  methodHandler: (method: string, args: object) => object
): T {
  const handler: ProxyHandler<T> = {
    get(target: T, prop: string, receiver) {
      if (methodFilter(prop)) {
        return (...args: object[]) => methodHandler(prop, args);
      } else {
        return Reflect.get(target, prop, receiver);
      }
    }
  };

  return new Proxy({}, handler) as T;
}
