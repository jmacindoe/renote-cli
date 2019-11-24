import { CliComponent } from "../../../../cli/model/CliComponent"
import { TextNote } from "../model/TextNote"
import { print } from "../../../../cli/model/CliPrint"

export async function* reviewTextNoteCli(note: TextNote): CliComponent {
  yield* print(note.body)
}
