export function updateNestedField(obj, pathArray, updater) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    pathArray.reduce((acc, key, i) => {
        if (acc[key] === undefined)
            acc[key] = {};
        if (i === pathArray.length - 1)
            acc[key] = updater(acc[key]);
        return acc[key];
    }, obj);
}
export const copy = (obj) => JSON.parse(JSON.stringify(obj));
