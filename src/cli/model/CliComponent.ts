import { CliOperation } from "./CliOperation"

export type CliComponent = AsyncGenerator<CliOperation, any, any>
