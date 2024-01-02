export function isHexString(str: string): boolean {
  const regex = /^(0x)?[0-9a-fA-F]+$/;
  return regex.test(str);
}