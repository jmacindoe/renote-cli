import { DueData } from "../../base/model/DueData"
import { serializeTextNoteTypeData, textNoteType } from "../model/TextNote"
import { createNoteUseCase } from "../../base/usecase/createNoteUseCase"
import { textNotePlugin } from "../textNotePlugin"

export async function createTextNoteUseCase(
  title: string,
  body: string,
  due: DueData,
): Promise<void> {
  const typeData = serializeTextNoteTypeData(title, body)
  const searchText = textNotePlugin.searchText(title, body)
  return createNoteUseCase(textNoteType, typeData, searchText, due)
}
