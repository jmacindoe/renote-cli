import { NoteDb } from "../db/NoteDb"
import { DueData } from "../model/DueData"

export async function updateNoteUseCase(
  _id: any,
  update: {
    typeData?: string
    searchText?: string
    due?: DueData
  },
): Promise<void> {
  const $set = {
    ...(update.typeData
      ? {
          typeData: update.typeData,
        }
      : {}),
    ...(update.searchText
      ? {
          searchText: update.searchText,
        }
      : {}),
    ...(update.due
      ? {
          nextDue: update.due.nextDue.daysSince1Jan2000(),
          dueAlgorithm: update.due.algorithm,
          dueAlgorithmData: update.due.algorithmData,
        }
      : {}),
  }
  await NoteDb.updateOne({ _id }, { $set }).exec()
}
