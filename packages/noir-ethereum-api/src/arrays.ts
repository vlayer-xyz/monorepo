export function padArrayRight(array: string[], n: number, pad: string) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result.push(i < array.length ? array[i] : pad);
    }
    return result;
}
