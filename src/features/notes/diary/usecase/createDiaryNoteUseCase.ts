import { DueData } from "../../base/model/DueData"
import { diaryNoteType } from "../model/DiaryNote"
import { createNoteUseCase } from "../../base/usecase/createNoteUseCase"
import { diaryNotePlugin } from "../diaryNotePlugin"

export async function createDiaryNoteUseCase(
  prompt: string,
  deck: string,
  due: DueData,
): Promise<void> {
  const typeData = diaryNotePlugin.serializeTypeData(prompt)
  const searchText = diaryNotePlugin.searchText(prompt)
  return createNoteUseCase(diaryNoteType, typeData, deck, searchText, due)
}
