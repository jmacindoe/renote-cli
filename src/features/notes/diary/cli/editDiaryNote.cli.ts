import { CliComponent } from "../../../../cli/model/CliComponent"
import { editorPrompt } from "../../../../cli/model/CliPrompt"
import { DiaryNote } from "../model/DiaryNote"
import { updateDiaryNoteUseCase } from "../usecase/updateDiaryNoteUseCase"

export async function* editDiaryNote(note: DiaryNote): CliComponent {
  const prompt = yield* editorPrompt("Diary prompt", note.prompt)
  await updateDiaryNoteUseCase(note._id, prompt)
}
