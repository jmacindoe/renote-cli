import { DueData } from "../../base/model/DueData"
import { diaryNoteType, serializeDiaryNoteTypeData } from "../model/DiaryNote"
import { createNoteUseCase } from "../../base/usecase/createNoteUseCase"
import { diaryNotePlugin } from "../diaryNotePlugin"

export async function createDiaryNoteUseCase(
  prompt: string,
  due: DueData,
): Promise<void> {
  const typeData = serializeDiaryNoteTypeData(prompt)
  const searchText = diaryNotePlugin.searchText(prompt)
  return createNoteUseCase(diaryNoteType, typeData, searchText, due)
}
