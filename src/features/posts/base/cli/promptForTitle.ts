import { CliComponent } from "../../../../cli/model/CliComponent"
import { prompt } from "../../../../cli/model/CliPrompt"

export async function* promptForTitle(): CliComponent<string> {
  const answers = yield* prompt([
    {
      type: "input",
      name: "title",
      message: "Title",
    },
  ])
  return answers.title
}
