export function assertDefined<T>(value: T | null | undefined): T {
  if (!value) {
    throw new Error("value is not defined: " + value)
  }
  return value
}
