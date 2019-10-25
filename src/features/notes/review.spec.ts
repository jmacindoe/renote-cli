import { TestBackendDb } from "../../db/TestBackendDb"
import { LocalDate } from "./base/model/LocalDate"
import { createTextNoteUseCase } from "./text/usecase/createTextNoteUseCase"
import { testCliInterpreter } from "../../cli/test/testCliInterpreter"
import { doReview } from "./review"
import { expectPrint } from "../../cli/test/expectPrint"
import { expectInput } from "../../cli/test/expectInput"

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

describe("review", () => {
  it("reviews the due notes", async () => {
    await createTextNoteUseCase("due yesterday", "body", new LocalDate(1000))
    await createTextNoteUseCase("due today", "body", new LocalDate(2000))
    await createTextNoteUseCase("not due yet", "body", new LocalDate(100000))

    await testCliInterpreter(doReview(), [
      expectPrint("# due yesterday\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now?", "3"),
      expectPrint("# due today\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now?", "2"),
    ])

    // TODO: assert on new due dates (e.g. move time forward)
  })
})
