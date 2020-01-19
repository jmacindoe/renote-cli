import { CliComponent } from "../../cli/model/CliComponent"
import {
  inputPrompt,
  listPromptKV,
  listPrompt,
} from "../../cli/model/CliPrompt"
import { noteTypePlugins } from "./noteTypePlugins"
import { searchNotesUseCase } from "./base/usecase/searchNotesUseCase"
import { print } from "../../cli/model/CliPrint"
import { Note } from "./base/model/Note"
import { getDefined } from "../../error/array"
import { promptForDeck } from "./base/cli/deck/promptForDeck"
import { updateNoteUseCase } from "./base/usecase/updateNoteUseCase"
import { describeWhenDue } from "./base/cli/describeWhenDue"
import { promptForRescheduledDueData } from "./base/cli/promptForRescheduledDueDate"
import { updateDueDateUseCase } from "./base/usecase/updateDueDateUseCase"
import { getDeckUseCase } from "../decks/usecase/getDeckUseCase"
import { editDeck } from "../decks/cli/editDeck.cli"

export async function* editNote(): CliComponent {
  const note = yield* findNote()
  const operation = yield* listPrompt([
    "Edit content",
    "Change deck",
    "Reschedule",
  ])

  switch (operation) {
    case "Edit content":
      const plugin = noteTypePlugins.getByType(note.type)
      yield* plugin.editNote(note)
      break
    case "Change deck":
      yield* editDeck(note)
      break
    case "Reschedule":
      yield* describeWhenDue(note.due)
      const nextDue = yield* promptForRescheduledDueData(note.due)
      await updateDueDateUseCase(note._id, nextDue)
      break
    default:
      throw new Error("Unknown operation: " + operation)
  }
}

async function* findNote(): CliComponent<Note> {
  const query = yield* inputPrompt("Note search")
  const results = await searchNotesUseCase(query)

  yield* print(`\nFound ${results.length} results\n`)

  const choices = results.map((result, index) => {
    const name = noteTypePlugins.asShortText(result)
    return {
      name,
      value: index,
    }
  })

  const newQueryChoice = {
    name: "New search",
    value: -1,
  }

  const choice = yield* listPromptKV([newQueryChoice].concat(choices))

  if (choice === newQueryChoice.value) {
    return yield* findNote()
  } else {
    return getDefined(results, choice)
  }
}
