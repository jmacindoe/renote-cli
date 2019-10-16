import { QuestionCollection, Answers } from "inquirer"

export interface CliPrompt {
  type: "prompt"
  questions: QuestionCollection<any>
}

export function* prompt<T extends Answers>(
  questions: QuestionCollection<T>,
): Generator<CliPrompt, T> {
  // @ts-ignore: return type is provided by inquirer lib
  return yield {
    type: "prompt",
    questions,
  }
}
