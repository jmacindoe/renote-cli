import { Note } from "./base/model/Note"
import { getDueNotesUseCase } from "./base/usecase/getDueNotesUseCase"
import { updateDueDateUseCase } from "./base/usecase/updateDueDateUseCase"
import { CliComponent } from "../../cli/model/CliComponent"
import { promptForNextDue } from "./base/cli/promptForNextDue"
import { noteTypePlugins } from "./noteTypePlugins"
import { print } from "../../cli/model/CliPrint"
// @ts-ignore
import shuffle from "knuth-shuffle-seeded"

export async function* doReview(): CliComponent {
  const notes = await getDueNotesUseCase()
  if (notes.length === 0) {
    yield* print("Nothing due today")
  } else {
    yield* print(`\nDue today: ${notes.length}\n`)
    yield* reviewNotes(notes)
  }
}

async function* reviewNotes(notes: Note[]): CliComponent {
  // This seed gives orders: [1], [2, 1], [3, 2, 1], [4, 2, 3, 1], [5, 2, 3, 4, 1]
  const shuffled = shuffle(notes, "fixed seed 1234")
  for (const note of shuffled) {
    yield* reviewNote(note)
    const due = yield* promptForNextDue(note.due)
    await updateDueDateUseCase(note._id, due)
  }
}

async function* reviewNote(note: Note): CliComponent {
  const plugin = noteTypePlugins.getByType(note.type)
  yield* plugin.reviewNote(note)
}
