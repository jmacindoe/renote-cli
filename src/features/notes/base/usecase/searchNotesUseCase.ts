import { NoteDb } from "../db/NoteDb"
import { Note } from "../model/Note"
import { noteTypePlugins } from "../../noteTypePlugins"

export async function searchNotesUseCase(query: string): Promise<Note[]> {
  const docs = await NoteDb.find({
    $text: { $search: query },
  }).exec()
  return noteTypePlugins.deserializeAll(docs)
}
