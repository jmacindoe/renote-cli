import { TestDslExpect } from "./TestDslExpect"
import { TestDslNegativeExpect } from "./TestDslNegativeExpect"
import { NoteDb } from "../../../features/notes/base/db/NoteDb"

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
}
