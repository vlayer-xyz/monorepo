export function mock<T extends object>(
  methodFilter: (method: string) => boolean,
  methodHandler: (method: string, args: unknown) => unknown
): T {
  const handler: ProxyHandler<T> = {
    get(target: T, method: string, receiver) {
      if (methodFilter(method)) {
        return (...args: object[]) => methodHandler(method, args);
      } else {
        return Reflect.get(target, method, receiver);
      }
    }
  };

  return new Proxy({}, handler) as T;
}
