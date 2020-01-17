import moment from "moment"
import { NoteDb } from "../db/NoteDb"
import { DueData } from "../model/DueData"
import { Deck } from "../../../decks/model/Deck"

export async function createNoteUseCase(
  type: string,
  typeData: string,
  deck: Deck,
  searchText: string,
  due: DueData,
): Promise<void> {
  await NoteDb.create({
    type,
    typeData,
    deckId: deck._id,
    createdAt: moment().format(),
    nextDue: due.nextDue.daysSince1Jan2000(),
    dueAlgorithm: due.algorithm,
    dueAlgorithmData: due.algorithmData,
    searchText,
  })
}
