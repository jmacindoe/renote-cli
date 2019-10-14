import inquirer from "inquirer"
import { nextDueFromString, showInHowManyDays } from "../../prompts/whenDue"
import { createTextPostUseCase } from "../usecase/createTextPostUseCase"

export async function createTextNoteCli(): Promise<void> {
  const answers = await inquirer.prompt([
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
  ])

  // @ts-ignore - TODO: why does TS fail here?
  const { title, body, nextDueInNDays } = answers
  const nextDue = nextDueFromString(nextDueInNDays)
  await createTextPostUseCase(title, body, nextDue)
}
