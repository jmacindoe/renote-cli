import { TestCliInteraction } from "./testCliInterpreter"

export function expectInput(
  question: string,
  response: string,
): TestCliInteraction {
  return {
    type: "prompt",
    kind: "input",
    question,
    response,
  }
}
