export function binaryToDecimal(binary: string): number {
  let dec = 0;
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < binary.length; i++) {
    dec *= 2;
    dec += +binary[i];
  }
  return dec;
}

export function decimalToBinary(decimal: number, minLength?: number): string {
  let binary = decimal.toString(2);
  if (minLength) {
    binary = '0'.repeat(minLength - binary.length) + binary;
  }
  return binary;
}

