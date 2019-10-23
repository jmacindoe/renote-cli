import moment from "moment"
import { LocalDate } from "../../base/model/LocalDate"
import { DiaryPostDb } from "../db/DiaryPostDb"

export async function createDiaryPostUseCase(
  title: string,
  body: string,
  nextDue: LocalDate,
): Promise<void> {
  await DiaryPostDb.create({
    title,
    body,
    createdAt: moment().format(),
    nextDue: nextDue.daysSince1Jan2000(),
  })
}
