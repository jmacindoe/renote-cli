import { Answers, DistinctQuestion } from "inquirer"
import { CliComponent } from "./CliComponent"

export interface CliPrompt {
  type: "prompt"
  question: DistinctQuestion<any>
}

function* prompt(question: DistinctQuestion): Generator<CliPrompt, any> {
  return yield {
    type: "prompt" as "prompt",
    question,
  }
}

export async function* inputPrompt(
  message: string,
  prefill?: string,
): CliComponent<string> {
  const answer = yield* prompt({
    type: "input",
    name: "result",
    message: prefill ? `${message} [${prefill}]` : message,
  })
  return prefill && answer === "" ? prefill : answer
}

export async function* editorPrompt(
  message: string,
  prefill: string = "",
): CliComponent<string> {
  return yield* prompt({
    type: "editor",
    name: "result",
    default: prefill,
    message,
  })
}

/// Returns `value` or the chosen string
export async function* listPrompt(choices: string[], args: {
  message: string
} = { message: "Menu" }): CliComponent<string> {
  return yield* prompt({
    type: "list",
    name: "result",
    message: args.message,
    choices,
  })
}

export interface NameValue<T> {
  name: string
  value: T
}

export async function* listPromptKV<T>(
  choices: Array<NameValue<T>>,
): CliComponent<T> {
  return yield* prompt({
    type: "list",
    name: "result",
    message: "Menu",
    choices,
  })
}

export async function* confirmPrompt(
  message: string,
  prefill?: boolean,
): CliComponent<boolean> {
  return yield* prompt({
    type: "confirm",
    name: "result",
    default: prefill,
    message,
  })
}

export async function* autocompletePrompt(
  message: string,
  source: (answersSoFar: any, input: string | undefined) => Promise<string[]>,
  args?: {
    /// User can input something not in the list. Defaults to false.
    suggestOnly: boolean
  }
): CliComponent<string> {
  return yield* prompt({
    // @ts-ignore: type is part of inquirer-autocomplete-prompt extension
    type: "autocomplete",
    name: "result",
    source,
    message,
    suggestOnly: args?.suggestOnly ?? false,
  })
}
