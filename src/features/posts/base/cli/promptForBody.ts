import { CliComponent } from "../../../../cli/model/CliComponent"
import { prompt } from "../../../../cli/model/CliPrompt"

export async function* promptForBody(): CliComponent<string> {
  const answers = yield* prompt([
    {
      type: "editor",
      name: "body",
      message: "Body",
    },
  ])
  return answers.body
}
