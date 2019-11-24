import { assertDefined } from "./assert"

export function getDefined<T>(arr: T[], index: number): T {
  const value = arr[index]
  assertDefined(value, "Array out of bounds")
  return value
}
