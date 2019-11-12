import moment from "moment"
import { DiaryNoteDb } from "../db/DiaryNoteDb"
import { DueData } from "../../base/model/DueData"

export async function createDiaryNoteUseCase(
  prompt: string,
  due: DueData,
): Promise<void> {
  await DiaryNoteDb.create({
    prompt,
    createdAt: moment().format(),
    nextDue: due.nextDue.daysSince1Jan2000(),
    dueAlgorithm: due.algorithm,
    dueAlgorithmData: due.algorithmData,
  })
}
