import { NoteDb } from "../db/NoteDb"

export async function getDecksUseCase(
  nameStartsWith: string,
): Promise<string[]> {
  // TODO: obviously this doesn't scale but it will work if I'm the only user :P
  const docs = await NoteDb.find({}).exec()
  const allDecks = docs.flatMap(doc => doc.deck)
  const uniqueDecks = Array.from(new Set(allDecks))
  return uniqueDecks.filter(deck => deck.startsWith(nameStartsWith))
}
