import { TestDslExpect } from "./TestDslExpect"
import { NoteDb } from "../../../features/notes/base/db/NoteDb"

export class TestDslNegativeExpect extends TestDslExpect {
  constructor() {
    super(true)
  }

  public async textNoteExists(body: string) {
    const typeData = JSON.stringify({
      body,
    })
    const docs = await NoteDb.find({
      typeData,
    }).exec()
    expect(docs.length).toEqual(0)
  }

  public async diaryNoteExists(prompt: string) {
    const typeData = JSON.stringify({
      prompt,
    })
    const docs = await NoteDb.find({
      typeData,
    }).exec()
    expect(docs.length).toEqual(0)
  }
}
