import { CliComponent } from "../../../../cli/model/CliComponent"
import { TextNote } from "../model/TextNote"
import { print } from "../../../../cli/model/CliPrint"

export async function* reviewTextNoteCli(note: TextNote): CliComponent {
  if (note.title !== "") {
    yield* print("# " + note.title + "\n")
  }
  yield* print(note.body)
}
