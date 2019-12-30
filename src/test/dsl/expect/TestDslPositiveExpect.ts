import { TestDslExpect } from "./TestDslExpect"
import { TestDslNegativeExpect } from "./TestDslNegativeExpect"
import { NoteDb } from "../../../features/notes/base/db/NoteDb"
import { TestDsl } from "../TestDsl"

export class TestDslPositiveExpect extends TestDslExpect {
  public not = new TestDslNegativeExpect()

  constructor() {
    super(false)
  }

  public async textNoteExists(body: string) {
    const typeData = JSON.stringify({
      body,
    })
    const docs = await NoteDb.find({
      typeData,
    }).exec()
    expect(docs.length).toEqual(1)
  }

  public async diaryNoteExists(prompt: string) {
    const typeData = JSON.stringify({
      prompt,
    })
    const docs = await NoteDb.find({
      typeData,
    }).exec()
    expect(docs.length).toEqual(1)
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
}
