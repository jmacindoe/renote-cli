import { CliComponent } from "../../../../cli/model/CliComponent"
import { listPrompt } from "../../../../cli/model/CliPrompt"
import { LocalDate } from "../model/LocalDate"
import { DueData } from "../model/DueData"
import { print } from "../../../../cli/model/CliPrint"
import { duePrompt, nDaysData } from "./duePrompt"
import { promptForRescheduledDueData } from "./promptForRescheduledDueDate"

const relativeToDueDate = "Schedule relative to due date"
const relativeToToday = "Schedule relative to today"
const customReschedule = "Custom reschedule"
const menu = "Menu"

export async function* promptForNextDue(
  previousDueData: DueData,
): CliComponent<DueData | "menu-requested"> {
  if (previousDueData.nextDue.isBefore(LocalDate.today())) {
    return yield* promptForNextDueWhenLate(previousDueData)
  } else {
    return yield* promptForNextDueWhenOnSchedule(previousDueData)
  }
}

async function* promptForNextDueWhenOnSchedule(
  previousDueData: DueData,
): CliComponent<DueData | "menu-requested"> {
  const answer = yield* duePrompt("with-menu", { previousDueData })

  if (answer === "menu-requested") {
    return "menu-requested"
  } else {
    return nDaysData({ nextShow: answer })
  }
}

async function* promptForNextDueWhenLate(
  previousDueData: DueData,
): CliComponent<DueData | "menu-requested"> {
  yield* print(describeWhenDue(previousDueData))

  const lateMenuAnswer = yield* listPrompt([
    relativeToDueDate,
    relativeToToday,
    customReschedule,
    menu,
  ])
  switch (lateMenuAnswer) {
    case relativeToDueDate:
      return yield* latePrompt(previousDueData, {
        relativeTo: previousDueData.nextDue,
      })
    case relativeToToday:
      return yield* latePrompt(previousDueData, {
        relativeTo: LocalDate.today(),
      })
    case customReschedule:
      return yield* promptForRescheduledDueData(previousDueData)
    case menu:
      return "menu-requested"
    default:
      throw new Error("Unexpected option: " + lateMenuAnswer)
  }
}

function describeWhenDue(previousDueData: DueData): string {
  const dueNDaysAgo =
    LocalDate.today().daysSince1Jan2000() -
    previousDueData.nextDue.daysSince1Jan2000()
  const dueString =
    dueNDaysAgo === 1
      ? "Note was due yesterday."
      : `Note was due ${dueNDaysAgo} days ago.`

  const showsEveryNDays = previousDueData.algorithmData
  const showsString =
    showsEveryNDays === "1"
      ? "Shows everyday."
      : `Shows every ${showsEveryNDays} days.`
  return `${dueString} ${showsString}`
}

async function* latePrompt(
  previousDueData: DueData,
  args: {
    relativeTo: LocalDate
  },
): CliComponent<DueData> {
  const nextShow = yield* duePrompt("without-menu", { previousDueData })
  const { relativeTo } = args
  return nDaysData({ nextShow, relativeTo })
}
