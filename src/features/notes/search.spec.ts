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

describe("search", () => {
  it("finds a note", async () => {
    await TestDsl.given.aTextNote("doc 1", 3)
    await TestDsl.given.aTextNote("doc 2", 3)

    await TestDsl.interaction(
      TestDsl.mainMenu.search(),
      TestDsl.expectInput("Query", "1"),
      TestDsl.expectList(["doc 1"], "doc 1"),
      TestDsl.expectPrint("doc 1"),
    )
  })

  it("returns all notes on an empty query", async () => {
    await TestDsl.given.aTextNote("doc 1", 3)
    await TestDsl.given.aTextNote("doc 2", 3)

    await TestDsl.interaction(
      TestDsl.mainMenu.search(),
      TestDsl.expectInput("Query", ""),
      TestDsl.expectList(["doc 1", "doc 2"], "doc 2"),
      TestDsl.expectPrint("doc 2"),
    )
  })

  it("informs user if no search results", async () => {
    await TestDsl.interaction(
      TestDsl.mainMenu.search(),
      TestDsl.expectInput("Query", "1"),
      TestDsl.expectPrint("No results"),
    )
  })
})
