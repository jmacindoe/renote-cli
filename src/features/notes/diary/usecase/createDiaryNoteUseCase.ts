import moment from "moment"
import { LocalDate } from "../../base/model/LocalDate"
import { DiaryNoteDb } from "../db/DiaryNoteDb"

export async function createDiaryNoteUseCase(
  prompt: string,
  nextDue: LocalDate,
): Promise<void> {
  await DiaryNoteDb.create({
    prompt,
    createdAt: moment().format(),
    nextDue: nextDue.daysSince1Jan2000(),
  })
}
