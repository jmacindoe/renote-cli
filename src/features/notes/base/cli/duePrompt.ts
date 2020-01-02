import { LocalDate } from "../model/LocalDate"
import { DueData } from "../model/DueData"
import { CliComponent } from "../../../../cli/model/CliComponent"
import { inputPrompt } from "../../../../cli/model/CliPrompt"

const nDaysAlgorithm = "NDays"
const defaultDuePromptText = "Show in how many days from now?"

export function nDaysData(args: {
  nextShow: number
  thenEvery?: number
  relativeTo?: LocalDate
}): DueData {
  const nextDue = (args.relativeTo || LocalDate.today()).addDays(args.nextShow)
  const thenEvery = args.thenEvery || args.nextShow
  return {
    nextDue,
    algorithm: nDaysAlgorithm,
    algorithmData: thenEvery.toString(),
  }
}

export function duePrompt(
  withMenu: "with-menu",
  args?: {
    promptText?: string
    previousDueData?: DueData
  },
): CliComponent<"menu-requested" | number>

export function duePrompt(
  withMenu: "without-menu",
  args?: {
    promptText?: string
    previousDueData?: DueData
  },
): CliComponent<number>

export function duePrompt(
  withMenu: "with-menu" | "without-menu",
  args?: {
    promptText?: string
    previousDueData?: DueData
  },
): CliComponent<"menu-requested" | number> {
  // TS does not allow overloading async generator signatures, so we overload a standard function and then call the generator
  return promptCli(withMenu, args?.promptText, args?.previousDueData)
}

async function* promptCli(
  withMenu: "with-menu" | "without-menu",
  promptText: string = defaultDuePromptText,
  previousDueData?: DueData,
): CliComponent<"menu-requested" | number> {
  const promptDefault = previousDueData
    ? defaultAnswer(previousDueData)
    : undefined
  const userAnswer = yield* inputPrompt(promptText, promptDefault)

  if (withMenu === "with-menu" && userAnswer === "m") {
    return "menu-requested"
  }

  const nextDue = nextDueFromString(userAnswer)

  if (nextDue === undefined) {
    return yield* promptCli(withMenu, promptText, previousDueData)
  }

  return nextDue
}

function defaultAnswer(previousDueData: DueData) {
  // Currently only NDays is implemented
  if (previousDueData.algorithm !== nDaysAlgorithm) {
    throw new Error("Unknown due algorithm: " + previousDueData.algorithmData)
  }

  return previousDueData.algorithmData
}

function nextDueFromString(nextDueInNDays: string): number | undefined {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return isNaN(nextDueInt) ? undefined : nextDueInt
}
