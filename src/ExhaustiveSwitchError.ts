/// By throwing this in the default case of a switch, we can ensure at compile time
/// that the switch is exhaustive. This is because Typescript will infer that the
/// argument passed to the Error is of type `never`
export class ExhaustiveSwitchError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`)
  }
}
