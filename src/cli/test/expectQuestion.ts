import { TestCliQuestionResponse } from "./testCliInterpreter"

export function expectQuestion(
  question: string,
  response: string,
): TestCliQuestionResponse {
  return {
    type: "question-response",
    question,
    response,
  }
}
