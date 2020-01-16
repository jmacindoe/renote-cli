import { TestCliInteraction } from "../../cli/test/testCliInterpreter";

export function expectConfirm(
  message: string,
  response: boolean,
  args?: {
    default?: boolean,
  }
): TestCliInteraction {
  return {
    type: "prompt",
    kind: "confirm",
    message,
    response,
    default: args?.default,
  }
}

export function expectAutocomplete(
  message: string,
  response: string,
  args?: {
    // Defaults to false
    suggestOnly?: boolean
    // Defaults to !suggestOnly
    responseMustAlreadyExist?: boolean
    expectedAutocompletions?: { [input: string]: string[] }
  }
): TestCliInteraction {
  const suggestOnly = args?.suggestOnly ?? false
  const responseMustAlreadyExist = args?.responseMustAlreadyExist ?? !suggestOnly
  const expectedAutocompletions = args?.expectedAutocompletions ?? {}
  return {
    type: "prompt",
    kind: "autocomplete",
    message,
    response,
    suggestOnly,
    responseMustAlreadyExist,
    expectedAutocompletions,
  }
}
