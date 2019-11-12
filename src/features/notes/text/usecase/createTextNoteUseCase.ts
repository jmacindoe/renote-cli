import moment from "moment"
import { TextNoteDb } from "../db/TextNoteDb"
import { DueData } from "../../base/model/DueData"

export async function createTextNoteUseCase(
  title: string,
  body: string,
  due: DueData,
): Promise<void> {
  await TextNoteDb.create({
    title,
    body,
    createdAt: moment().format(),
    nextDue: due.nextDue.daysSince1Jan2000(),
    dueAlgorithm: due.algorithm,
    dueAlgorithmData: due.algorithmData,
  })
}
