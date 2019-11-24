import { CliComponent } from "../../../../cli/model/CliComponent"
import { inputPrompt, editorPrompt } from "../../../../cli/model/CliPrompt"
import { TextNote } from "../model/TextNote"
import { updateTextNoteUseCase } from "../usecase/updateTextNoteUseCase"

export async function* editTextNoteCli(note: TextNote): CliComponent {
  const title = yield* inputPrompt("Title", note.title)
  const body = yield* editorPrompt("Body", note.body)
  await updateTextNoteUseCase(note._id, title, body)
}
