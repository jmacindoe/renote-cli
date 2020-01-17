import mongoose, { Document } from "mongoose"
import { Deck } from "../model/Deck"

export type DbDeck = Document & {
  _id: any
  name: string
}

export const DeckDb = mongoose.model<DbDeck>(
  "Deck",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
  }),
)

export function deserializeDeck(doc: DbDeck): Deck {
  return {
    _id: doc._id,
    name: doc.name,
  }
}
