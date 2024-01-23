export function updateNestedField<T, V>(obj: T, pathArray: string[], updater: (value: V) => V): void {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  pathArray.reduce((acc: any, key: string, i: number) => {
    if (acc[key] === undefined) acc[key] = {};
    if (i === pathArray.length - 1) acc[key] = updater(acc[key]);
    return acc[key];
  }, obj);
}
