import moment from "moment"
import { LocalDate } from "../../base/model/LocalDate"
import { TextNoteDb } from "../db/TextNoteDb"

export async function createTextNoteUseCase(
  title: string,
  body: string,
  nextDue: LocalDate,
): Promise<void> {
  await TextNoteDb.create({
    title,
    body,
    createdAt: moment().format(),
    nextDue: nextDue.daysSince1Jan2000(),
  })
}
