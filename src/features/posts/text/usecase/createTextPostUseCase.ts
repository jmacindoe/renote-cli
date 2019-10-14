import moment from "moment"
import { LocalDate } from "../../base/model/LocalDate"
import { TextPostDb } from "../db/TextPostDb"

export async function createTextPostUseCase(
  title: string,
  body: string,
  nextDue: LocalDate,
): Promise<void> {
  await TextPostDb.create({
    title,
    body,
    createdAt: moment().format(),
    nextDue: nextDue.daysSince1Jan2000(),
  })
}
