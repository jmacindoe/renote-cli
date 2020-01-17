import { Deck } from "../model/Deck"
import { DeckDb, deserializeDeck } from "../db/DeckDb"

export async function getDecksUseCase(nameContains: string): Promise<Deck[]> {
  const docs = await DeckDb.find({
    name: { $regex: `.*${nameContains}.*` },
  }).exec()
  return docs.map(deserializeDeck)
}
