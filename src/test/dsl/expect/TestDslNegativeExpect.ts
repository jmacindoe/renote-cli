import { TestDslExpect } from "./TestDslExpect"
import { NoteDb } from "../../../features/notes/base/db/NoteDb"
import { getTextNotes, getDiaryNotes } from "./TestDslPositiveExpect"

export class TestDslNegativeExpect extends TestDslExpect {
  constructor() {
    super(true)
  }

  public async textNoteExists(body: string) {
    const notes = await getTextNotes(body)
    expect(notes).toHaveLength(0)
  }

  public async diaryNoteExists(prompt: string) {
    const notes = await getDiaryNotes(prompt)
    expect(notes).toHaveLength(0)
  }
}
