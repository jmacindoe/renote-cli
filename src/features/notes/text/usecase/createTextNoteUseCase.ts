import { DueData } from "../../base/model/DueData"
import { textNoteType } from "../model/TextNote"
import { createNoteUseCase } from "../../base/usecase/createNoteUseCase"
import { textNotePlugin } from "../textNotePlugin"

export async function createTextNoteUseCase(
  title: string,
  body: string,
  due: DueData,
): Promise<void> {
  const typeData = textNotePlugin.serializeTypeData(title, body)
  const searchText = textNotePlugin.searchText(title, body)
  return createNoteUseCase(textNoteType, typeData, searchText, due)
}
