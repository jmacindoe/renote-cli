import { Answers, DistinctQuestion } from "inquirer"

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
