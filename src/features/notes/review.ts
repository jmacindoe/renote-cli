import { Note } from "./base/model/Note"
import { getDueNotesUseCase } from "./base/usecase/getDueNotesUseCase"
import { updateDueDateUseCase } from "./base/usecase/updateDueDateUseCase"
import { CliComponent } from "../../cli/model/CliComponent"
import { promptForNextDue } from "./base/cli/promptForNextDue"
import { noteTypePlugins } from "./noteTypePlugins"

export async function* doReview(): CliComponent {
  const notes = await getDueNotesUseCase()
  if (notes.length === 0) {
    console.log("Nothing due today")
  } else {
    yield* reviewNotes(notes)
  }
}

async function* reviewNotes(notes: Note[]): CliComponent {
  for (const note of notes) {
    yield* reviewNote(note)
    const due = yield* promptForNextDue(note.due)
    await updateDueDateUseCase(note._id, due)
  }
}

async function* reviewNote(note: Note): CliComponent {
  const plugin = noteTypePlugins.getByType(note.type)
  yield* plugin.reviewNote(note)
}
