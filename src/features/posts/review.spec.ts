import { TestBackendDb } from "../../db/TestBackendDb"
import { LocalDate } from "./base/model/LocalDate"
import { createTextPostUseCase } from "./text/usecase/createTextPostUseCase"
import { testCliInterpreter } from "../../cli/test/testCliInterpreter"
import { doReview } from "./review"
import { expectPrint } from "../../cli/test/expectPrint"
import { expectQuestion } from "../../cli/test/expectQuestion"

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
    await createTextPostUseCase("due yesterday", "body", new LocalDate(1000))
    await createTextPostUseCase("due today", "body", new LocalDate(2000))
    await createTextPostUseCase("not due yet", "body", new LocalDate(100000))

    await testCliInterpreter(doReview(), [
      expectPrint("# due yesterday\n"),
      expectPrint("body"),
      expectQuestion("Show in how many days from now?", "3"),
      expectPrint("# due today\n"),
      expectPrint("body"),
      expectQuestion("Show in how many days from now?", "2"),
    ])
  })
})
