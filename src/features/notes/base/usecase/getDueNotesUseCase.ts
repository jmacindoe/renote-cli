import { LocalDate } from "../model/LocalDate"
import { Note } from "../model/Note"
import { NoteDb } from "../db/NoteDb"
import { noteTypePlugins } from "../../noteTypePlugins"

export async function getDueNotesUseCase(
  dueOn: LocalDate = new LocalDate(),
): Promise<Note[]> {
  const docs = await NoteDb.find({
    nextDue: { $lte: dueOn.daysSince1Jan2000() },
  }).exec()
  return noteTypePlugins.deserializeAll(docs)
}
