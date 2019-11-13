import { CliComponent } from "../../cli/model/CliComponent"
import { inputPrompt } from "../../cli/model/CliPrompt"
import { noteTypePlugins } from "./noteTypePlugins"
import { searchNotesUseCase } from "./base/usecase/searchNotesUseCase"
import { print } from "../../cli/model/CliPrint"

export async function* search(): CliComponent {
  const query = yield* inputPrompt("Query")
  const results = await searchNotesUseCase(query)
  for (const result of results) {
    yield* print(noteTypePlugins.debugDescription(result))
  }
}
