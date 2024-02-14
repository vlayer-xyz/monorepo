export function incHexStr(hexStr: string): string {
  return '0x' + (BigInt(hexStr) + 1n).toString(16);
}

export function incHexByte(hexByte: string): string {
  const newByte = ((parseInt(hexByte) + 1) % 256).toString(16);
  return '0x' + newByte;
}
