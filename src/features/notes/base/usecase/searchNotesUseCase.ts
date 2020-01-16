import { NoteDb } from "../db/NoteDb"
import { Note } from "../model/Note"
import { noteTypePlugins } from "../../noteTypePlugins"

export async function searchNotesUseCase(
  query: string,
  deck?: string,
): Promise<Note[]> {
  const docs = await NoteDb.find({
    $text: { $search: query },
    ...(deck ? { deck } : {}),
  }).exec()
  return noteTypePlugins.deserializeAll(docs)
}
