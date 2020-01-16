import { CliComponent } from "../../../../cli/model/CliComponent"
import { promptForFirstDue } from "../../base/cli/promptForFirstDue"
import { createTextNoteUseCase } from "../usecase/createTextNoteUseCase"
import { editorPrompt } from "../../../../cli/model/CliPrompt"
import { promptForDeck } from "../../base/cli/deck/promptForDeck"

export async function* createTextNoteCli(): CliComponent {
  const body = yield* editorPrompt("Body")
  const deck = yield* promptForDeck()
  const due = yield* promptForFirstDue()
  await createTextNoteUseCase(body, deck, due)
}
