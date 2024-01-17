export function mock<T extends object>(methodHandler: (method: string, args: object) => object): T {
  const handler: ProxyHandler<T> = {
    get(_target: T, prop: string) {
      return (...args: object[]) => methodHandler(prop, args);
    }
  };

  return new Proxy({}, handler) as T;
}
