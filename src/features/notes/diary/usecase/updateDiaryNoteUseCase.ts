import { diaryNotePlugin } from "../diaryNotePlugin"
import { updateNoteUseCase } from "../../base/usecase/updateNoteUseCase"

export async function updateDiaryNoteUseCase(
  _id: any,
  prompt: string,
): Promise<void> {
  const typeData = diaryNotePlugin.serializeTypeData(prompt)
  const searchText = diaryNotePlugin.searchText(prompt)
  return updateNoteUseCase(_id, { typeData, searchText })
}
