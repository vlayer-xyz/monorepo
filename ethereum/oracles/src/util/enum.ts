export class Enum {
  public static size<T extends object>(enumObj: T): number {
    const keys = Object.keys(enumObj).filter((key) => isNaN(Number(key)));
    return keys.length;
  }
}
