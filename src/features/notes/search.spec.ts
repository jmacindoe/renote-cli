import { TestBackendDb } from "../../db/TestBackendDb"
import { testCliInterpreter } from "../../cli/test/testCliInterpreter"
import { expectPrint } from "../../cli/test/expectPrint"
import { expectInput } from "../../cli/test/expectInput"
import { addNote } from "./add"
import { expectList } from "../../cli/test/expectList"
import { expectEditor } from "../../cli/test/expectEditor"
import { search } from "./search"

const db = new TestBackendDb()

beforeAll(async () => {
  await db.init()
})

afterAll(async () => {
  await db.tearDown()
})

afterEach(async () => {
  await db.deleteAllData()
})

describe("search", () => {
  it("finds a note", async () => {
    await testCliInterpreter(addNote(), [
      expectList(null, "Text"),
      expectEditor("Body", "doc 1"),
      expectInput("Show in how many days from now?", "3"),
    ])

    await testCliInterpreter(addNote(), [
      expectList(null, "Text"),
      expectEditor("Body", "doc 2"),
      expectInput("Show in how many days from now?", "3"),
    ])

    await testCliInterpreter(search(), [
      expectInput("Query", "1"),
      expectPrint("doc 1"),
    ])
  })

  it("informs user if no search results", async () => {
    await testCliInterpreter(search(), [
      expectInput("Query", "1"),
      expectPrint("No results"),
    ])
  })
})
