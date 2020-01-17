import { TestCliList } from "./testCliInterpreter"

export function expectList(
  options: string[] | null,
  choice: string,
  args: { message: string } = { message: "Menu" },
): TestCliList {
  return {
    type: "prompt",
    kind: "list",
    choice,
    options,
    message: args.message,
  }
}
