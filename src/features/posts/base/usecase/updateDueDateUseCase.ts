import { BasePostDb } from "../db/BasePostDb"
import { LocalDate } from "../model/LocalDate"

export async function updateDueDateUseCase(_id: any, newDueDate: LocalDate) {
  await BasePostDb.updateOne(
    { _id },
    { $set: { nextDue: newDueDate.daysSince1Jan2000() } },
  ).exec()
}
