const paramsRegex = /((function|event)\s)?(.*)(\((.*)\))/;
/** @deprecated – use `parseAbiItem` from `abitype`. */
export function extractFunctionParts(def) {
    const parts = def.match(paramsRegex);
    const type = parts?.[2] || undefined;
    const name = parts?.[3];
    const params = parts?.[5] || undefined;
    return { type, name, params };
}
/** @deprecated – use `parseAbiItem` from `abitype`. */
export function extractFunctionName(def) {
    return extractFunctionParts(def).name;
}
/** @deprecated – use `parseAbiItem` from `abitype`. */
export function extractFunctionParams(def) {
    const params = extractFunctionParts(def).params;
    const splitParams = params?.split(',').map((x) => x.trim().split(' '));
    return splitParams?.map((param) => ({
        type: param[0],
        name: param[1] === 'indexed' ? param[2] : param[1],
        ...(param[1] === 'indexed' ? { indexed: true } : {}),
    }));
}
/** @deprecated – use `parseAbiItem` from `abitype`. */
export function extractFunctionType(def) {
    return extractFunctionParts(def).type;
}
//# sourceMappingURL=extractFunctionParts.js.map