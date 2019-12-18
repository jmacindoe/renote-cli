import { CliComponent } from "../../cli/model/CliComponent"
import { inputPrompt, listPromptKV } from "../../cli/model/CliPrompt"
import { noteTypePlugins } from "./noteTypePlugins"
import { searchNotesUseCase } from "./base/usecase/searchNotesUseCase"
import { print } from "../../cli/model/CliPrint"
import { Note } from "./base/model/Note"
import { getDefined } from "../../error/array"

export async function* editNote(): CliComponent {
  const note = yield* findNote()
  const plugin = noteTypePlugins.getByType(note.type)
  yield* plugin.editNote(note)
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
