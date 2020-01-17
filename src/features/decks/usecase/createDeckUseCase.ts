import { DeckDb, deserializeDeck } from "../db/DeckDb"
import { Deck } from "../model/Deck"

export async function createDeckUseCase(name: string): Promise<Deck> {
  const deck = await DeckDb.create({
    name,
  })
  return deserializeDeck(deck)
}
