import inquirer from "inquirer"
import { RenoteDb } from "../db"
import { nextDueFromString, showInHowManyDays } from "../prompts/whenDue"

export async function addNote(db: RenoteDb) {
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
  await db.createPost(title, body, nextDue)
}
