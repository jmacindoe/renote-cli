export function assert(test: boolean, message?: string) {
  if (!test) {
    throw new Error(message || "Failed assertion")
  }
}

export function assertDefined<T>(
  value: T | null | undefined,
  message?: string,
): T {
  if (!value) {
    throw new Error(message || "value is not defined: " + value)
  }
  return value
}
