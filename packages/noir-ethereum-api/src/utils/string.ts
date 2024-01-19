export const incHexStr = (hexStr: string): string => '0x' + (BigInt(hexStr) + 1n).toString(16);
