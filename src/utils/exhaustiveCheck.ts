export function exhaustiveCheck(param: never): never {
  throw new Error(`Unhandled case: ${param}`);
}
