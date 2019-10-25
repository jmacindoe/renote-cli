import { LocalDate } from "../model/LocalDate"
import { Note } from "../model/Note"
import { BaseNoteDb } from "../db/BaseNoteDb"
import { noteTypePlugins } from "../../noteTypePlugins"

export async function getDueNotesUseCase(
  dueOn: LocalDate = new LocalDate(),
): Promise<Note[]> {
  const docs = await BaseNoteDb.find({
    nextDue: { $lte: dueOn.daysSince1Jan2000() },
  }).exec()
  return noteTypePlugins.deserializeAll(docs)
}
