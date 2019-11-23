import { TestCliList } from "./testCliInterpreter"

export function expectList(choice: string, options?: string[]): TestCliList {
  return {
    type: "prompt",
    kind: "list",
    choice,
    options,
  }
}
