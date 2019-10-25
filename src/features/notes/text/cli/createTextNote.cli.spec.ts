import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { TestBackendDb } from "../../../../db/TestBackendDb"
import { BaseNoteDb } from "../../base/db/BaseNoteDb"
import { createTextNoteCli } from "./createTextNote.cli"
import { expectInput } from "../../../../cli/test/expectInput"
import { expectEditor } from "../../../../cli/test/expectEditor"

const db = new TestBackendDb()

beforeAll(async () => {
  await db.init()
})

afterAll(() => {
  db.tearDown()
})

afterEach(async () => {
  await db.deleteAllData()
})

describe("createTextNote.cli", () => {
  it("creates a text note document in mongodb", async () => {
    await testCliInterpreter(createTextNoteCli(), [
      expectInput("Title", "the title"),
      expectEditor("Body", "The body"),
      expectInput("Show in how many days from now?", "3"),
    ])

    const docs = await BaseNoteDb.find().exec()
    expect(docs.length).toEqual(1)
    const doc = docs[0] as any
    expect(doc.__t).toEqual("TextNote")
    expect(doc.title).toEqual("the title")
    expect(doc.body).toEqual("The body")
    // TODO: test nextDue (and createdAt)
  })
})
