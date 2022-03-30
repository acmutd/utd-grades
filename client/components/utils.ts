export function splitName(name: string): [first: string, last: string] {
  const space = name.lastIndexOf(' ');
  return [name.substring(0, space), name.substring(space + 1)];
}
