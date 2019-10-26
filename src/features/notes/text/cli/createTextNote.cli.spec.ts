import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { TestBackendDb } from "../../../../db/TestBackendDb"
import { BaseNoteDb } from "../../base/db/BaseNoteDb"
import { createTextNoteCli } from "./createTextNote.cli"
import { expectInput } from "../../../../cli/test/expectInput"
import { expectEditor } from "../../../../cli/test/expectEditor"
import { MockTime } from "../../../../test/MockTime"
import { LocalDate } from "../../base/model/LocalDate"

const db = new TestBackendDb()

beforeAll(async () => {
  await db.init()
})

afterAll(() => {
  db.tearDown()
})

beforeEach(() => {
  MockTime.install()
})

afterEach(async () => {
  await db.deleteAllData()
  MockTime.reset()
})

describe("createTextNote.cli", () => {
  it("creates a text note document in mongodb", async () => {
    const nextDue = 3

    await testCliInterpreter(createTextNoteCli(), [
      expectInput("Title", "the title"),
      expectEditor("Body", "The body"),
      expectInput("Show in how many days from now?", nextDue.toString()),
    ])

    const docs = await BaseNoteDb.find().exec()
    expect(docs.length).toEqual(1)
    const doc = docs[0] as any
    expect(doc.__t).toEqual("TextNote")
    expect(doc.title).toEqual("the title")
    expect(doc.body).toEqual("The body")
    expect(doc.nextDue).toEqual(MockTime.initialMockedLocalDate + nextDue)
    expect(doc.createdAt).toEqual("2010-01-01T11:00:00+02:00")
  })
})
