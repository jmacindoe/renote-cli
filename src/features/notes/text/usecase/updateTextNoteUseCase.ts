import { textNotePlugin } from "../textNotePlugin"
import { Note } from "../../base/model/Note"
import { updateNoteUseCase } from "../../base/usecase/updateNoteUseCase"

export async function updateTextNoteUseCase(
  _id: any,
  body: string,
): Promise<void> {
  const typeData = textNotePlugin.serializeTypeData(body)
  const searchText = textNotePlugin.searchText(body)
  return updateNoteUseCase(_id, { typeData, searchText })
}
