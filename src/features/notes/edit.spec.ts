import { TestBackendDb } from "../../db/TestBackendDb"
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
    await TestDsl.interaction(
      TestDsl.mainMenu.editNote(),
      TestDsl.expectInput("Note search", "anything"),
      TestDsl.expectPrint("\nFound 0 results\n"),
      TestDsl.expectList(["New search"], "New search"),
      TestDsl.expectInput("Note search", "anything"),
      TestDsl.expectPrint("\nFound 0 results\n"),
      TestDsl.expectList(["New search"], "New search"),
      TestDsl.anyFurtherInteraction(),
    )
  })

  it("edits a text note", async () => {
    await TestDsl.given.aTextNote("doc 1", 3)

    await TestDsl.interaction(
      TestDsl.mainMenu.editNote(),
      TestDsl.expectInput("Note search", "1"),
      TestDsl.expectPrint("\nFound 1 results\n"),
      TestDsl.expectList(["New search", "doc 1"], "doc 1"),
      TestDsl.expectEditor("Body", "doc 2"),
    )

    await TestDsl.expect.not.textNoteExists("doc 1")
    await TestDsl.expect.textNoteExists("doc 2")
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
