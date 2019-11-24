import { CliComponent } from "../../cli/model/CliComponent"
import { inputPrompt } from "../../cli/model/CliPrompt"
import { noteTypePlugins } from "./noteTypePlugins"
import { searchNotesUseCase } from "./base/usecase/searchNotesUseCase"
import { print } from "../../cli/model/CliPrint"
import { Note } from "./base/model/Note"

export async function* search(): CliComponent {
  const query = yield* inputPrompt("Query")
  const results = await searchNotesUseCase(query)
  if (results.length === 0) {
    yield* print("No results")
  } else {
    yield* printResults(results)
  }
}

async function* printResults(results: Note[]): CliComponent {
  for (const result of results) {
    yield* print(noteTypePlugins.debugDescription(result))
  }
}
