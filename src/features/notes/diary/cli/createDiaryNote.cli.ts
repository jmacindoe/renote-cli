import { CliComponent } from "../../../../cli/model/CliComponent"
import { promptForFirstDue } from "../../base/cli/promptForFirstDue"
import { createDiaryNoteUseCase } from "../usecase/createDiaryNoteUseCase"
import { editorPrompt } from "../../../../cli/model/CliPrompt"
import { promptForDeck } from "../../base/cli/deck/promptForDeck"

export async function* createDiaryNote(): CliComponent {
  const prompt = yield* editorPrompt("Diary prompt")
  const deck = yield* promptForDeck()
  const due = yield* promptForFirstDue()
  await createDiaryNoteUseCase(prompt, deck, due)
}
