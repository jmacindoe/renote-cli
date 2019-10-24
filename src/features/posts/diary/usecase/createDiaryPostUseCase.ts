import moment from "moment"
import { LocalDate } from "../../base/model/LocalDate"
import { DiaryPostDb } from "../db/DiaryPostDb"

export async function createDiaryPostUseCase(
  prompt: string,
  nextDue: LocalDate,
): Promise<void> {
  await DiaryPostDb.create({
    prompt,
    createdAt: moment().format(),
    nextDue: nextDue.daysSince1Jan2000(),
  })
}
