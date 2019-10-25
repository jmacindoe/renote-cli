import { CliComponent } from "../../cli/model/CliComponent"
import { listPrompt } from "../../cli/model/CliPrompt"
import { noteTypePlugins } from "./postTypePlugins"

export async function* addNote(): CliComponent {
  const noteType = yield* listPrompt(noteTypePlugins.getUiNames())
  const plugin = noteTypePlugins.getByUiName(noteType)
  yield* plugin.createNote()
}
