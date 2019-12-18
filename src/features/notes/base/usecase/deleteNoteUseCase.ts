import { NoteDb } from "../db/NoteDb";

export async function deleteNoteUseCase(_id: any) {
  await NoteDb.deleteOne({ _id })
}
