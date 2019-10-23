import { CliOperation } from "./CliOperation"

export type CliComponent<TReturn = any> = AsyncGenerator<
  CliOperation,
  TReturn,
  any
>
