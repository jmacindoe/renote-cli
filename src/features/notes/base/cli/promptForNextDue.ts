import { CliComponent } from "../../../../cli/model/CliComponent"
import { inputPrompt } from "../../../../cli/model/CliPrompt"
import { LocalDate } from "../model/LocalDate"
import { DueData } from "../model/DueData"

const nDaysAlgorithm = "NDays"

export async function* promptForFirstDue(): CliComponent<DueData> {
  const nextDueInNDays = yield* inputPrompt("Show in how many days from now?")
  const nextDue = nextDueFromString(nextDueInNDays)

  if (!nextDue) {
    return yield* promptForFirstDue()
  }

  return {
    nextDue,
    algorithm: nDaysAlgorithm,
    algorithmData: nextDueInNDays,
  }
}

export async function* promptForNextDue(
  previousDueData: DueData,
): CliComponent<DueData | "menu-requested"> {
  // Currently only NDays is implemented
  if (previousDueData.algorithm !== nDaysAlgorithm) {
    throw new Error("Unknown due algorithm: " + previousDueData.algorithmData)
  }

  const previousNDays = previousDueData.algorithmData
  const answer = yield* inputPrompt(
    `Show in how many days from now?`,
    previousNDays,
  )

  if (answer === "m") {
    return "menu-requested"
  }

  const nextDue = nextDueFromString(answer)
  if (!nextDue) {
    return yield* promptForNextDue(previousDueData)
  }

  return {
    nextDue,
    algorithm: nDaysAlgorithm,
    algorithmData: answer,
  }
}

function nextDueFromString(nextDueInNDays: string): LocalDate | undefined {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return isNaN(nextDueInt) ? undefined : new LocalDate().addDays(nextDueInt)
}
