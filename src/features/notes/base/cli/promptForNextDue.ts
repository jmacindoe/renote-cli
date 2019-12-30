import { CliComponent } from "../../../../cli/model/CliComponent"
import { inputPrompt } from "../../../../cli/model/CliPrompt"
import { LocalDate } from "../model/LocalDate"
import { DueData } from "../model/DueData"

const nDaysAlgorithm = "NDays"

export async function* promptForFirstDue(): CliComponent<DueData> {
  const answer = yield* prompt(
    "without-menu",
    "Show in how many days from now?",
  )

  return {
    nextDue: answer.nextDue,
    algorithm: nDaysAlgorithm,
    algorithmData: answer.userAnswer,
  }
}

export async function* promptForNextDue(
  previousDueData: DueData,
): CliComponent<DueData | "menu-requested"> {
  const answer = yield* prompt(
    "with-menu",
    "Show in how many days from now?",
    previousDueData,
  )

  if (answer === "menu-requested") {
    return "menu-requested"
  } else {
    return {
      nextDue: answer.nextDue,
      algorithm: nDaysAlgorithm,
      algorithmData: answer.userAnswer,
    }
  }
}

export async function* promptForRescheduledNextDue(
  previousDueData: DueData,
): CliComponent<DueData> {
  const nextShow = yield* prompt("without-menu", "Next show in how many days?")
  const thenShow = yield* prompt(
    "without-menu",
    "Then show every n days:",
    previousDueData,
  )

  return {
    nextDue: nextShow.nextDue,
    algorithm: nDaysAlgorithm,
    algorithmData: thenShow.userAnswer,
  }
}

interface PromptAnswer {
  userAnswer: string
  nextDue: LocalDate
}

function prompt(
  withMenu: "with-menu",
  promptText: string,
  previousDueData?: DueData,
): CliComponent<"menu-requested" | PromptAnswer>

function prompt(
  withMenu: "without-menu",
  promptText: string,
  previousDueData?: DueData,
): CliComponent<PromptAnswer>

function prompt(
  withMenu: "with-menu" | "without-menu",
  promptText: string,
  previousDueData?: DueData,
): CliComponent<"menu-requested" | PromptAnswer> {
  // TS does not allow overloading async generator signatures, so we overload a standard function and then call the generator
  return promptCli(withMenu, promptText, previousDueData)
}

async function* promptCli(
  withMenu: "with-menu" | "without-menu",
  promptText: string,
  previousDueData?: DueData,
): CliComponent<"menu-requested" | PromptAnswer> {
  const promptDefault = previousDueData
    ? defaultAnswer(previousDueData)
    : undefined
  const userAnswer = yield* inputPrompt(promptText, promptDefault)

  if (withMenu === "with-menu" && userAnswer === "m") {
    return "menu-requested"
  }

  const nextDue = nextDueFromString(userAnswer)

  if (!nextDue) {
    return yield* promptCli(withMenu, promptText, previousDueData)
  }

  return {
    userAnswer,
    nextDue,
  }
}

function defaultAnswer(previousDueData: DueData) {
  // Currently only NDays is implemented
  if (previousDueData.algorithm !== nDaysAlgorithm) {
    throw new Error("Unknown due algorithm: " + previousDueData.algorithmData)
  }

  return previousDueData.algorithmData
}

function nextDueFromString(nextDueInNDays: string): LocalDate | undefined {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return isNaN(nextDueInt) ? undefined : new LocalDate().addDays(nextDueInt)
}
