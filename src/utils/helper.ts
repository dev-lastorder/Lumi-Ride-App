export function handleTruncate(
  maxLength: number,
  input: string | number
): string {
  const strInput: string = String(input);
  if (strInput.length > maxLength) {
    return strInput.slice(0, maxLength) + "...";
  }
  return strInput;
}

export function maskNumber(num: number | string, visibleLength: number): string {
  const str = String(num);

  if (visibleLength <= 0) return '*'.repeat(str.length);
  if (visibleLength >= str.length) return str;

  const maskedPart = '*'.repeat(4);
  const visiblePart = str.slice(-visibleLength);

  return maskedPart +  ' ' +visiblePart;
}