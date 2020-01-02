import { DueData } from "../model/DueData"
import { CliComponent } from "../../../../cli/model/CliComponent"
import { print } from "../../../../cli/model/CliPrint"
import { LocalDate } from "../model/LocalDate"

export async function* describeWhenDue(dueData: DueData): CliComponent {
  yield* print(description(dueData))
}

function description(dueData: DueData): string {
  const showsEveryNDays = dueData.algorithmData
  const showsString =
    showsEveryNDays === "1"
      ? "Shows everyday."
      : `Shows every ${showsEveryNDays} days.`
  return `${dueString(dueData)} ${showsString}`
}

function dueString(dueData: DueData): string {
  const dueNDaysAgo =
    LocalDate.today().daysSince1Jan2000() - dueData.nextDue.daysSince1Jan2000()
  if (dueNDaysAgo === 0) {
    return "Note is due today."
  } else if (dueNDaysAgo === 1) {
    return "Note was due yesterday."
  } else if (dueNDaysAgo === -1) {
    return "Note is due tomorrow."
  } else if (dueNDaysAgo > 1) {
    return `Note was due ${dueNDaysAgo} days ago.`
  } else if (dueNDaysAgo < -1) {
    return `Note is due in ${-dueNDaysAgo} days.`
  }
  throw new Error("Unreachable error")
}
