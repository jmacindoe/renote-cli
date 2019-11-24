import { CliComponent } from "../../../../cli/model/CliComponent"
import { promptForNextDue } from "../../base/cli/promptForNextDue"
import { createTextNoteUseCase } from "../usecase/createTextNoteUseCase"
import { inputPrompt, editorPrompt } from "../../../../cli/model/CliPrompt"

export async function* createTextNoteCli(): CliComponent {
  const body = yield* editorPrompt("Body")
  const due = yield* promptForNextDue()
  await createTextNoteUseCase(body, due)
}
