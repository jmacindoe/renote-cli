import { CliComponent } from "../../../../cli/model/CliComponent"
import { promptForFirstDue } from "../../base/cli/promptForNextDue"
import { createDiaryNoteUseCase } from "../usecase/createDiaryNoteUseCase"
import { editorPrompt } from "../../../../cli/model/CliPrompt"

export async function* createDiaryNote(): CliComponent {
  const prompt = yield* editorPrompt("Diary prompt")
  const due = yield* promptForFirstDue()
  await createDiaryNoteUseCase(prompt, due)
}
