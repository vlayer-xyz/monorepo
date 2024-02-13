/// DECODE
export function decodeNoirArguments(params) {
    return params.map((it) => {
        if ('Single' in it) {
            return ['0x' + it.Single.inner];
        }
        else {
            return it.Array.map((it) => '0x' + it.inner);
        }
    });
}
/// ENCODE
export function encodeForeignCallResult(noirOutputs) {
    return { values: noirOutputs.map(encodeForeignCallResultValue) };
}
function encodeForeignCallResultValue(noirOutput) {
    if (typeof noirOutput === 'string') {
        return { Single: { inner: noirOutput } };
    }
    else {
        return {
            Array: noirOutput.map((inner) => ({
                inner
            }))
        };
    }
}
