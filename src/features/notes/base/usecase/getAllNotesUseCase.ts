import { NoteDb } from "../db/NoteDb"
import { Note } from "../model/Note"
import { noteTypePlugins } from "../../noteTypePlugins"

export async function getAllNotesUseCase(): Promise<Note[]> {
  const docs = await NoteDb.find({}).exec()
  return noteTypePlugins.deserializeAll(docs)
}
