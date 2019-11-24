import { CliComponent } from "../../../../cli/model/CliComponent"
import { inputPrompt } from "../../../../cli/model/CliPrompt"
import { LocalDate } from "../model/LocalDate"
import { DueData } from "../model/DueData"

const nDaysAlgorithm = "NDays"

export async function* promptForNextDue(
  // Do not pass if creating a new note
  previousDueData?: DueData,
): CliComponent<DueData> {
  if (!previousDueData) {
    return yield* firstTimePrompt()
  } else {
    return yield* updateDueDate(previousDueData)
  }
}

export async function* firstTimePrompt(): CliComponent<DueData> {
  const nextDueInNDays = yield* inputPrompt("Show in how many days from now?")
  const nextDue = nextDueFromString(nextDueInNDays)

  if (!nextDue) {
    return yield* firstTimePrompt()
  }

  return {
    nextDue,
    algorithm: nDaysAlgorithm,
    algorithmData: nextDueInNDays,
  }
}

export async function* updateDueDate(
  previousDueData: DueData,
): CliComponent<DueData> {
  // Currently only NDays is implemented
  if (previousDueData.algorithm !== nDaysAlgorithm) {
    throw new Error("Unknown due algorithm: " + previousDueData.algorithmData)
  }

  const previousNDays = previousDueData.algorithmData
  const nextDueInNDays = yield* inputPrompt(
    `Show in how many days from now?`,
    previousNDays,
  )
  const nextDue = nextDueFromString(nextDueInNDays)

  if (!nextDue) {
    return yield* updateDueDate(previousDueData)
  }

  return {
    nextDue,
    algorithm: nDaysAlgorithm,
    algorithmData: nextDueInNDays,
  }
}

function nextDueFromString(nextDueInNDays: string): LocalDate | undefined {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return isNaN(nextDueInt) ? undefined : new LocalDate().addDays(nextDueInt)
}
