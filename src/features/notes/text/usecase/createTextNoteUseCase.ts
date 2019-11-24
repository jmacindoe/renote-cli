import { DueData } from "../../base/model/DueData"
import { textNoteType } from "../model/TextNote"
import { createNoteUseCase } from "../../base/usecase/createNoteUseCase"
import { textNotePlugin } from "../textNotePlugin"

export async function createTextNoteUseCase(
  body: string,
  due: DueData,
): Promise<void> {
  const typeData = textNotePlugin.serializeTypeData(body)
  const searchText = textNotePlugin.searchText(body)
  return createNoteUseCase(textNoteType, typeData, searchText, due)
}
