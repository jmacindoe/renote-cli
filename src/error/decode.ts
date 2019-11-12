import * as t from "io-ts"
import { PathReporter } from "io-ts/lib/PathReporter"
import { isLeft } from "fp-ts/lib/Either"

export function decodeOrThrow<A>(
  type: t.InterfaceType<any, A, any>,
  /// If a JSON string is provided, it will be parsed
  input: A | string,
): A {
  const obj = typeof input === "string" ? JSON.parse(input) : input
  const decoded = type.decode(obj)
  if (isLeft(decoded)) {
    throw Error(
      "Data did not match io-ts form. Actual: " +
        JSON.stringify(input) +
        ". Errors: " +
        JSON.stringify(PathReporter.report(decoded)),
    )
  }
  return obj
}
