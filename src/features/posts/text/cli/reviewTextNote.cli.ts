import { CliComponent } from "../../../../cli/model/CliComponent"
import { TextPost } from "../model/TextPost"
import { print } from "../../../../cli/model/CliPrint"

export async function* reviewTextNoteCli(note: TextPost): CliComponent {
  if (note.title !== "") {
    yield* print("# " + note.title + "\n")
  }
  yield* print(note.body)
}
