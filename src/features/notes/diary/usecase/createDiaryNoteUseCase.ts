import { DueData } from "../../base/model/DueData"
import { diaryNoteType, serializeDiaryNoteTypeData } from "../model/DiaryNote"
import { createNoteUseCase } from "../../base/usecase/createNoteUseCase"

export async function createDiaryNoteUseCase(
  prompt: string,
  due: DueData,
): Promise<void> {
  const typeData = serializeDiaryNoteTypeData(prompt)
  return createNoteUseCase(diaryNoteType, typeData, due)
}
