import { NoteDb } from "../db/NoteDb"
import { Note } from "../model/Note"
import { noteTypePlugins } from "../../noteTypePlugins"
import { Deck } from "../../../decks/model/Deck"

export async function searchNotesUseCase(
  query: string,
  deck?: Deck,
): Promise<Note[]> {
  const docs = await NoteDb.find({
    $text: { $search: query },
    ...(deck ? { deckId: deck._id } : {}),
  }).exec()
  return noteTypePlugins.deserializeAll(docs)
}
