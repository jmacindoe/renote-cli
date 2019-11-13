import moment from "moment"
import { NoteDb } from "../db/NoteDb"
import { DueData } from "../model/DueData"

export async function createNoteUseCase(
  type: string,
  typeData: string,
  searchText: string,
  due: DueData,
): Promise<void> {
  await NoteDb.create({
    deck: "default", // Decks aren't implemented yet
    type,
    typeData,
    createdAt: moment().format(),
    nextDue: due.nextDue.daysSince1Jan2000(),
    dueAlgorithm: due.algorithm,
    dueAlgorithmData: due.algorithmData,
    searchText,
  })
}