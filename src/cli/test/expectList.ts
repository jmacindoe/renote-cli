import { TestCliList } from "./testCliInterpreter"

export function expectList(response: string): TestCliList {
  return {
    type: "prompt",
    kind: "list",
    response,
  }
}
