import { expectQuestion } from "../../../../cli/test/expectQuestion"
import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { TestBackendDb } from "../../../../db/TestBackendDb"
import { BasePostDb } from "../../base/db/BasePostDb"
import { createTextNoteCli } from "./createTextNote.cli"

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
  it("creates a text post document in mongodb", async () => {
    await testCliInterpreter(createTextNoteCli(), [
      expectQuestion("Title", "the title"),
      expectQuestion("Body", "The body"),
      expectQuestion("Show in how many days from now?", "3"),
    ])

    const docs = await BasePostDb.find().exec()
    expect(docs.length).toEqual(1)
    const doc = docs[0] as any
    expect(doc.__t).toEqual("TextPost")
    expect(doc.title).toEqual("the title")
    expect(doc.body).toEqual("The body")
    // TODO: test nextDue (and createdAt)
  })
})
