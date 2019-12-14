import { TestBackendDb } from "../../db/TestBackendDb"
import { testCliInterpreter } from "../../cli/test/testCliInterpreter"
import { expectPrint } from "../../cli/test/expectPrint"
import { expectInput } from "../../cli/test/expectInput"
import { addNote } from "./add"
import { expectList } from "../../cli/test/expectList"
import { expectEditor } from "../../cli/test/expectEditor"
import { search } from "./search"
import { editNote } from "./edit"
import { anyFurtherInteraction } from "../../cli/test/anyFurtherInteraction"
import { TestDsl } from "../../test/dsl/TestDsl"

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

describe("edit", () => {
  it("allows for a new search query", async () => {
    await testCliInterpreter(editNote(), [
      expectInput("Note search", "anything"),
      expectPrint("\nFound 0 results\n"),
      expectList(["New search"], "New search"),
      expectInput("Note search", "anything"),
      expectPrint("\nFound 0 results\n"),
      expectList(["New search"], "New search"),
      anyFurtherInteraction(),
    ])
  })

  it("edits a text note", async () => {
    await testCliInterpreter(addNote(), [
      expectList(null, "Text"),
      expectEditor("Body", "doc 1"),
      expectInput("Show in how many days from now?", "3"),
    ])

    await testCliInterpreter(editNote(), [
      expectInput("Note search", "1"),
      expectPrint("\nFound 1 results\n"),
      expectList(["New search", "doc 1"], "doc 1"),
      expectEditor("Body", "doc 2"),
    ])

    // Assert the original text is gone from the DB
    await testCliInterpreter(search(), [
      expectInput("Query", "1"),
      expectPrint("No results"),
    ])

    // Assert the new text is present in the DB
    await testCliInterpreter(search(), [
      expectInput("Query", "2"),
      expectPrint("doc 2"),
    ])
  })

  it("edits a diary note", async () => {
    await TestDsl.given.aDiaryNote("Q", 1)

    await TestDsl.interaction(
      TestDsl.mainMenu.editNote(),
      TestDsl.expectInput("Note search", "Q"),
      TestDsl.expectPrint("\nFound 1 results\n"),
      TestDsl.expectList(["New search", "Q"], "Q"),
      TestDsl.expectEditor("Diary prompt", "new"),
    )

    await TestDsl.expect.not.diaryNoteExists("Q")
    await TestDsl.expect.diaryNoteExists("new")
  })
})
