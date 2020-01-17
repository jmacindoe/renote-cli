import { NoteDb } from "../db/NoteDb"
import { DueData } from "../model/DueData"
import { Deck } from "../../../decks/model/Deck"

export async function updateNoteUseCase(
  _id: any,
  update: {
    typeData?: string
    searchText?: string
    due?: DueData
    deck?: Deck
  },
): Promise<void> {
  const $set = {
    ...(update.typeData
      ? {
          typeData: update.typeData,
        }
      : {}),
    ...(update.searchText
      ? {
          searchText: update.searchText,
        }
      : {}),
    ...(update.due
      ? {
          nextDue: update.due.nextDue.daysSince1Jan2000(),
          dueAlgorithm: update.due.algorithm,
          dueAlgorithmData: update.due.algorithmData,
        }
      : {}),
    ...(update.deck
      ? {
          deckId: update.deck._id,
        }
      : {}),
  }
  await NoteDb.updateOne({ _id }, { $set }).exec()
}
