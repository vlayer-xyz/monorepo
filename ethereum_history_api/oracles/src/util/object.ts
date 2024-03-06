interface NestedObject<V> {
  [key: string]: NestedObject<V> | V;
}

export function updateNestedField<T, V>(obj: T, pathArray: string[], updater: (value: V) => V): void {
  let currentSubtree = obj as NestedObject<V>;
  const pathWithoutLast = pathArray.slice(0, pathArray.length - 1);
  const lastPathElem = pathArray[pathArray.length - 1];
  for (const pathElem of pathWithoutLast) {
    currentSubtree = currentSubtree[pathElem] as NestedObject<V>;
  }

  currentSubtree[lastPathElem] = updater(currentSubtree[lastPathElem] as V);
}

export const copy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;
