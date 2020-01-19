import { Deck } from "../model/Deck"
import { DeckDb, deserializeDeck } from "../db/DeckDb"
import { Id } from "../../../db/Id"

export async function getDeckUseCase(_id: Id): Promise<Deck> {
  const docs = await DeckDb.find({
    _id,
  }).exec()

  if (docs.length === 1) {
    return deserializeDeck(docs[0])
  } else {
    throw new Error("No such deck: " + _id)
  }
}
