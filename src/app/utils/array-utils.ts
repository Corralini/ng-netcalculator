export function arrayToString(array: any[]): string {
  let str = '';
  array.forEach(value => {
    str += value;
  });
  return str;
}
