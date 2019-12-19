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
export async function* listPrompt(choices: string[]): CliComponent<string> {
  return yield* prompt({
    type: "list",
    name: "result",
    message: "Menu",
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
