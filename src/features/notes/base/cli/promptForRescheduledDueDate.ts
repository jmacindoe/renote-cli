import { DueData } from "../model/DueData"
import { CliComponent } from "../../../../cli/model/CliComponent"
import { duePrompt, nDaysData } from "./duePrompt"

export async function* promptForRescheduledDueData(
  previousDueData: DueData,
): CliComponent<DueData> {
  const nextShow = yield* duePrompt("without-menu", {
    promptText: "Next show in how many days?",
  })
  const thenEvery = yield* duePrompt("without-menu", {
    promptText: "Then show every n days:",
    previousDueData,
  })

  return nDaysData({ nextShow, thenEvery })
}
