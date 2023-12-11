/**
 * Checks whether a given VNode is a render-vialble element.
 */
export function isValidVNodeElement(input: any): boolean {
  return (
    input &&
    (typeof input.tag === "string" ||
      typeof input.tag === "object" ||
      typeof input.tag === "function")
  );
}
