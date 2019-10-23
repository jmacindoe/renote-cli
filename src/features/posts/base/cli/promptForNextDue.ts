import { CliComponent } from "../../../../cli/model/CliComponent"
import { prompt } from "../../../../cli/model/CliPrompt"
import { LocalDate } from "../model/LocalDate"

export async function* promptForNextDue(): CliComponent<LocalDate> {
  const answers = yield* prompt([
    {
      type: "input",
      name: "nextDueInNDays",
      message: "Show in how many days from now?",
    },
  ])
  return nextDueFromString(answers.nextDueInNDays)
}

function nextDueFromString(nextDueInNDays: string): LocalDate {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return new LocalDate().addDays(nextDueInt)
}
