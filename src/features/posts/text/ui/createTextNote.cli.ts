import { CliComponent } from "../../../../cli/model/CliComponent"
import { nextDueFromString, showInHowManyDays } from "../../prompts/whenDue"
import { createTextPostUseCase } from "../usecase/createTextPostUseCase"

export async function* createTextNoteCli(): CliComponent {
  const answers = yield {
    type: "prompt",
    questions: [
      {
        type: "input",
        name: "title",
        message: "Title",
      },
      {
        type: "editor",
        name: "body",
        message: "Body",
      },
      showInHowManyDays,
    ],
  }
  const { title, body, nextDueInNDays } = answers
  const nextDue = nextDueFromString(nextDueInNDays)
  await createTextPostUseCase(title, body, nextDue)
}
