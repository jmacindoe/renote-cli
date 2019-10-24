import { TestCliPrint } from "./testCliInterpreter"

export function expectPrint(text: string): TestCliPrint {
  return {
    type: "print",
    text,
  }
}
