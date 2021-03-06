import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { TestBackendDb } from "../../../../db/TestBackendDb"
import { NoteDb } from "../../base/db/NoteDb"
import { createTextNoteCli } from "./createTextNote.cli"
import { expectInput } from "../../../../cli/test/expectInput"
import { expectEditor } from "../../../../cli/test/expectEditor"
import { MockTime } from "../../../../test/MockTime"
import { LocalDate } from "../../base/model/LocalDate"
import { TestDsl } from "../../../../test/dsl/TestDsl"

const db = new TestBackendDb()

beforeAll(async () => {
  await db.init()
})

afterAll(async () => {
  await db.tearDown()
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
      expectEditor("Body", "The body"),
      ...TestDsl.deck.chooseToCreateNewDeck([], "deck"),
      TestDsl.addNote.showIn(nextDue),
    ])

    const docs = await NoteDb.find().exec()
    expect(docs.length).toEqual(1)
    const doc = docs[0] as any
    expect(doc.type).toEqual("TextNote")
    expect(doc.typeData).toMatchInlineSnapshot(`"{\\"body\\":\\"The body\\"}"`)
    expect(doc.deckId).toBeDefined()
    expect(doc.nextDue).toEqual(MockTime.initialMockedLocalDate + nextDue)
    expect(doc.createdAt).toEqual("2008-03-19T11:00:00+02:00")
  })
})
