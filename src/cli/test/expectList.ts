import { TestCliList } from "./testCliInterpreter"

export function expectList(
  options: string[] | null,
  choice: string,
): TestCliList {
  return {
    type: "prompt",
    kind: "list",
    choice,
    options,
  }
}
