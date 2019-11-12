import { BaseNoteDb } from "../db/BaseNoteDb"
import { DueData } from "../model/DueData"

export async function updateDueDateUseCase(_id: any, newDue: DueData) {
  await BaseNoteDb.updateOne(
    { _id },
    {
      $set: {
        nextDue: newDue.nextDue.daysSince1Jan2000(),
        dueAlgorithm: newDue.algorithm,
        dueAlgorithmData: newDue.algorithmData,
      },
    },
  ).exec()
}
