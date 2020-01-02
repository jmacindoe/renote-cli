import { duePrompt, nDaysData } from "./duePrompt"
import { CliComponent } from "../../../../cli/model/CliComponent"
import { DueData } from "../model/DueData"

export async function* promptForFirstDue(): CliComponent<DueData> {
  const nextShow = yield* duePrompt("without-menu")
  return nDaysData({ nextShow })
}
