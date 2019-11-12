import { CliComponent } from "../../../../cli/model/CliComponent"
import { inputPrompt } from "../../../../cli/model/CliPrompt"
import { LocalDate } from "../model/LocalDate"
import { DueData } from "../model/DueData"

const delimiter = "|"
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

  const algorithmData = `${nDaysAlgorithm}${delimiter}${nextDueInNDays}`
  return {
    nextDue,
    algorithmData,
  }
}

export async function* updateDueDate(
  previousDueData: DueData,
): CliComponent<DueData> {
  const previousNDays = getPreviousNDays(previousDueData)
  const input = yield* inputPrompt(
    `Show in how many days from now? [${previousNDays}]`,
  )
  const nextDueInNDays = input === "" ? previousNDays : input
  const nextDue = nextDueFromString(nextDueInNDays)

  if (!nextDue) {
    return yield* updateDueDate(previousDueData)
  }

  const algorithmData = `${nDaysAlgorithm}${delimiter}${nextDueInNDays}`
  return {
    nextDue,
    algorithmData,
  }
}

function nextDueFromString(nextDueInNDays: string): LocalDate | undefined {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return isNaN(nextDueInt) ? undefined : new LocalDate().addDays(nextDueInt)
}

function getPreviousNDays(previousDueData: DueData): string {
  const [algorithm, nDays] = previousDueData.algorithmData.split(delimiter)

  // Currently only NDays is implemented
  if (algorithm !== nDaysAlgorithm) {
    throw new Error("Unknown due algorithm: " + previousDueData.algorithmData)
  }

  return nDays
}
