import { CliComponent } from "../../cli/model/CliComponent"
import { findNote } from "./edit"
import { promptForRescheduledDueData } from "./base/cli/promptForRescheduledDueDate"
import { updateDueDateUseCase } from "./base/usecase/updateDueDateUseCase"
import { describeWhenDue } from "./base/cli/describeWhenDue"

export async function* rescheduleNote(): CliComponent {
  const note = yield* findNote()
  yield* describeWhenDue(note.due)
  const nextDue = yield* promptForRescheduledDueData(note.due)
  await updateDueDateUseCase(note._id, nextDue)
}
