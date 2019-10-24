import { Answers, DistinctQuestion } from "inquirer"
import { CliComponent } from "./CliComponent"

export interface CliPrompt {
  type: "prompt"
  questions: ReadonlyArray<DistinctQuestion<any>>
}

export function* prompt<T extends Answers>(
  questions: ReadonlyArray<DistinctQuestion<T>>,
): Generator<CliPrompt, T> {
  // @ts-ignore: return type is provided by inquirer lib
  return yield {
    type: "prompt" as "prompt",
    questions,
  }
}

export async function* inputPrompt(message: string): CliComponent<string> {
  const answer = yield* prompt([
    {
      type: "input",
      name: "result",
      message,
    },
  ])
  return answer.result
}

export async function* editorPrompt(message: string): CliComponent<string> {
  const answer = yield* prompt([
    {
      type: "editor",
      name: "result",
      message,
    },
  ])
  return answer.result
}
