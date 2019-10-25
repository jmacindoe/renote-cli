import { TestBackendDb } from "../../../db/TestBackendDb"
import { testCliInterpreter } from "../../../cli/test/testCliInterpreter"
import { addNote } from "../add"
import { expectList } from "../../../cli/test/expectList"
import { expectEditor } from "../../../cli/test/expectEditor"
import { expectInput } from "../../../cli/test/expectInput"

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

describe("diary e2e", () => {
  it("creates and reviews a note", async () => {
    await testCliInterpreter(addNote(), [
      expectList("Diary"),
      expectEditor("Diary prompt", "What is up?"),
      expectInput("Show in how many days from now?", "3"),
    ])
  })
})
