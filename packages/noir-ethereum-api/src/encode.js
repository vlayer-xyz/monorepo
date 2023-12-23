export function hexToString(hex) {
  return String.fromCharCode(parseInt(hex, 16))
}

export function argToString(arg) {
  return arg.map((e) => hexToString(e.substr(-2))).join('');
}

export function argToBigIng(arg) {
  return parseInt(arg[0], 16)
}
