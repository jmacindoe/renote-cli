import { BaseNoteDb } from "../db/BaseNoteDb"
import { LocalDate } from "../model/LocalDate"

export async function updateDueDateUseCase(_id: any, newDueDate: LocalDate) {
  await BaseNoteDb.updateOne(
    { _id },
    { $set: { nextDue: newDueDate.daysSince1Jan2000() } },
  ).exec()
}
