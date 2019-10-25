import moment from "moment"
import { DiaryEntryDb } from "../../diary/db/DiaryEntryDb"

export async function createDiaryEntryUseCase(body: string): Promise<void> {
  await DiaryEntryDb.create({
    body,
    createdAt: moment().format(),
  })
}
