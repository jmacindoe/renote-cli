import { QuestionCollection } from "inquirer"

export interface CliPrompt {
  type: "prompt"
  questions: QuestionCollection
}
