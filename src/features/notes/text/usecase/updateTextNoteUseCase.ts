import { textNotePlugin } from "../textNotePlugin"
import { Note } from "../../base/model/Note"
import { updateNoteUseCase } from "../../base/usecase/updateNoteUseCase"

export async function updateTextNoteUseCase(
  _id: any,
  title: string,
  body: string,
): Promise<void> {
  const typeData = textNotePlugin.serializeTypeData(title, body)
  const searchText = textNotePlugin.searchText(title, body)
  return updateNoteUseCase(_id, { typeData, searchText })
}
