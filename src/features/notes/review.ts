import { Note } from "./base/model/Note"
import { getDueNotesUseCase } from "./base/usecase/getDueNotesUseCase"
import { updateDueDateUseCase } from "./base/usecase/updateDueDateUseCase"
import { CliComponent } from "../../cli/model/CliComponent"
import { promptForNextDue } from "./base/cli/promptForNextDue"
import { promptForRescheduledDueData } from "./base/cli/promptForRescheduledDueDate"
import { noteTypePlugins } from "./noteTypePlugins"
import { print } from "../../cli/model/CliPrint"
// @ts-ignore
import shuffle from "knuth-shuffle-seeded"
import { listPrompt } from "../../cli/model/CliPrompt"
import { deleteNoteUseCase } from "./base/usecase/deleteNoteUseCase"
import { editDeck } from "../decks/cli/editDeck.cli"
import { getDeckUseCase } from "../decks/usecase/getDeckUseCase"

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
    yield* nextDuePrompt(note)
  }
}

async function* reviewNote(note: Note): CliComponent {
  const plugin = noteTypePlugins.getByType(note.type)
  yield* plugin.reviewNote(note)
}

async function* nextDuePrompt(note: Note): CliComponent {
  const nextDue = yield* promptForNextDue(note.due)
  if (nextDue === "menu-requested") {
    yield* menu(note)
  } else {
    await updateDueDateUseCase(note._id, nextDue)
  }
}

async function* menu(note: Note): CliComponent {
  const op = yield* listPrompt([
    "Info",
    "Edit",
    "Reschedule",
    "Change deck",
    "Delete",
  ])

  if (op === "Info") {
    const currentDeck = await getDeckUseCase(note.deckId)
    yield* print("Deck: " + currentDeck.name)
  } else if (op === "Edit") {
    const plugin = noteTypePlugins.getByType(note.type)
    yield* plugin.editNote(note)
  } else if (op === "Reschedule") {
    const nextDue = yield* promptForRescheduledDueData(note.due)
    await updateDueDateUseCase(note._id, nextDue)
    return
  } else if (op === "Change deck") {
    yield* editDeck(note)
  } else if (op === "Delete") {
    await deleteNoteUseCase(note._id)
    return
  }

  yield* nextDuePrompt(note)
}
