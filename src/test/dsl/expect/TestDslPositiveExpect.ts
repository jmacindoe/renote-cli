import { TestDslExpect } from "./TestDslExpect"
import { TestDslNegativeExpect } from "./TestDslNegativeExpect"
import { NoteDb, DbNote } from "../../../features/notes/base/db/NoteDb"
import { TestDsl } from "../TestDsl"
import { DbDeck, DeckDb } from "../../../features/decks/db/DeckDb"

export class TestDslPositiveExpect extends TestDslExpect {
  public not = new TestDslNegativeExpect()

  constructor() {
    super(false)
  }

  public async textNoteExists(body: string) {
    const notes = await getTextNotes(body)
    expect(notes).toHaveLength(1)
  }

  public async diaryNoteExists(prompt: string) {
    const notes = await getDiaryNotes(prompt)
    expect(notes).toHaveLength(1)
  }

  public async noNotesDueToday() {
    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.noneDue(),
    )
  }

  public async notesDueToday(
    notes: Array<{
      text: string
      previousDue: number
      showInResponse: number | ""
    }>,
  ) {
    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.dueToday(notes.length),
      ...notes.flatMap(note => [
        TestDsl.expectPrint(note.text),
        TestDsl.reviewNote.showIn({
          previous: note.previousDue,
          new: note.showInResponse,
        }),
      ]),
    )
  }

  public async textNoteIsInDeck(body: string, deckName: string) {
    const note = await getTextNote(body)
    const deck = await getDeck(deckName)
    expect(note.deckId).toEqual(deck._id)
  }
}

export async function getTextNote(body: string): Promise<DbNote> {
  const notes = await getTextNotes(body)
  expect(notes).toHaveLength(1)
  return notes[0]
}

export async function getTextNotes(body: string): Promise<DbNote[]> {
  const typeData = JSON.stringify({
    body,
  })
  const docs = await NoteDb.find({
    typeData,
  }).exec()
  return docs
}

export async function getDiaryNote(prompt: string): Promise<DbNote> {
  const notes = await getDiaryNotes(prompt)
  expect(notes).toHaveLength(1)
  return notes[0]
}

export async function getDiaryNotes(prompt: string): Promise<DbNote[]> {
  const typeData = JSON.stringify({
    prompt,
  })
  const docs = await NoteDb.find({
    typeData,
  }).exec()
  return docs
}

export async function getDeck(name: string): Promise<DbDeck> {
  const docs = await DeckDb.find({
    name,
  })
  expect(docs).toHaveLength(1)
  return docs[0]
}
