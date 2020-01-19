import { Note } from "../../notes/base/model/Note"
import { CliComponent } from "../../../cli/model/CliComponent"
import { getDeckUseCase } from "../usecase/getDeckUseCase"
import { print } from "../../../cli/model/CliPrint"
import { promptForDeck } from "../../notes/base/cli/deck/promptForDeck"
import { updateNoteUseCase } from "../../notes/base/usecase/updateNoteUseCase"

export async function* editDeck(note: Note): CliComponent {
  const currentDeck = await getDeckUseCase(note.deckId)
  yield* print("Current deck: " + currentDeck.name)
  const deck = yield* promptForDeck()
  await updateNoteUseCase(note._id, { deck })
}
