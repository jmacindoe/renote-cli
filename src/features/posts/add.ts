import { CliComponent } from "../../cli/model/CliComponent"
import { prompt } from "../../cli/model/CliPrompt"
import { assertDefined } from "../../error/assert"
import { postTypePlugins } from "./postTypePlugins"

export async function* addNote(): CliComponent {
  const noteType = yield* promptForNoteType()
  const plugin = assertDefined(postTypePlugins.find(p => p.name === noteType))
  yield* plugin.createNote()
}

async function* promptForNoteType(): CliComponent<string> {
  const choice = yield* prompt([
    {
      type: "list",
      name: "noteType",
      choices: postTypePlugins.map(p => p.name),
    },
  ])
  return choice.noteType
}
