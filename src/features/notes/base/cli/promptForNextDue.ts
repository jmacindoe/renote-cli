import { CliComponent } from "../../../../cli/model/CliComponent"
import { inputPrompt } from "../../../../cli/model/CliPrompt"
import { LocalDate } from "../model/LocalDate"

export async function* promptForNextDue(): CliComponent<LocalDate> {
  const nextDueInNDays = yield* inputPrompt("Show in how many days from now?")
  return nextDueFromString(nextDueInNDays)
}

function nextDueFromString(nextDueInNDays: string): LocalDate {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return new LocalDate().addDays(nextDueInt)
}
