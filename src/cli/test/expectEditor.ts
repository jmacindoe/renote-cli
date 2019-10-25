import { TestCliInteraction } from "./testCliInterpreter"

export function expectEditor(
  question: string,
  response: string,
): TestCliInteraction {
  return {
    type: "prompt",
    kind: "editor",
    question,
    response,
  }
}
