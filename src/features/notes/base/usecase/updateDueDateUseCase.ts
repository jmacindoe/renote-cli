import { DueData } from "../model/DueData"
import { updateNoteUseCase } from "./updateNoteUseCase"

export async function updateDueDateUseCase(_id: any, due: DueData) {
  await updateNoteUseCase(_id, { due })
}
