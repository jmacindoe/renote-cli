import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { TestBackendDb } from "../../../../db/TestBackendDb"
import { NoteDb } from "../../base/db/NoteDb"
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

    const docs = await NoteDb.find().exec()
    expect(docs.length).toEqual(1)
    const doc = docs[0] as any
    expect(doc.type).toEqual("TextNote")
    expect(doc.typeData).toMatchInlineSnapshot(
      `"{\\"title\\":\\"the title\\",\\"body\\":\\"The body\\"}"`,
    )
    expect(doc.nextDue).toEqual(MockTime.initialMockedLocalDate + nextDue)
    expect(doc.createdAt).toEqual("2010-01-01T11:00:00+02:00")
  })
})
