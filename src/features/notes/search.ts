import { CliComponent } from "../../cli/model/CliComponent"
import { inputPrompt, listPromptKV } from "../../cli/model/CliPrompt"
import { noteTypePlugins } from "./noteTypePlugins"
import { searchNotesUseCase } from "./base/usecase/searchNotesUseCase"
import { print } from "../../cli/model/CliPrint"
import { Note } from "./base/model/Note"
import { getAllNotesUseCase } from "./base/usecase/getAllNotesUseCase"

export async function* search(): CliComponent {
  const query = yield* inputPrompt("Query")
  const results = await (query === ""
    ? getAllNotesUseCase()
    : searchNotesUseCase(query))
  if (results.length === 0) {
    yield* print("No results")
  } else {
    yield* printResults(results)
  }
}

async function* printResults(results: Note[]): CliComponent {
  const options = results.map((note, index) => ({
    name: noteTypePlugins.asShortText(note),
    value: index,
  }))
  const selected = yield* listPromptKV(options)
  yield* print(noteTypePlugins.asText(results[selected]))
}
