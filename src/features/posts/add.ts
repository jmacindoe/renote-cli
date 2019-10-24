import { CliComponent } from "../../cli/model/CliComponent"
import { prompt } from "../../cli/model/CliPrompt"
import { noteTypePlugins } from "./postTypePlugins"

export async function* addNote(): CliComponent {
  const noteType = yield* promptForNoteType()
  const plugin = noteTypePlugins.getByName(noteType)
  yield* plugin.createNote()
}

async function* promptForNoteType(): CliComponent<string> {
  const choice = yield* prompt([
    {
      type: "list",
      name: "noteType",
      choices: noteTypePlugins.getNames(),
    },
  ])
  return choice.noteType
}
