import { TestBackendDb } from "../../db/TestBackendDb"
import { LocalDate } from "./base/model/LocalDate"
import { createTextNoteUseCase } from "./text/usecase/createTextNoteUseCase"
import { testCliInterpreter } from "../../cli/test/testCliInterpreter"
import { doReview } from "./review"
import { expectPrint } from "../../cli/test/expectPrint"
import { expectInput } from "../../cli/test/expectInput"
import { MockTime } from "../../test/MockTime"

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

describe("review", () => {
  it("reviews the due notes", async () => {
    await createTextNoteUseCase(
      "due yesterday",
      "body",
      new LocalDate(MockTime.initialMockedLocalDate - 1),
    )
    await createTextNoteUseCase(
      "due today",
      "body",
      new LocalDate(MockTime.initialMockedLocalDate),
    )
    await createTextNoteUseCase(
      "not due yet",
      "body",
      new LocalDate(MockTime.initialMockedLocalDate + 1),
    )

    await testCliInterpreter(doReview(), [
      expectPrint("# due yesterday\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now?", "1"),
      expectPrint("# due today\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now?", "2"),
    ])

    MockTime.tickDays(1)

    await testCliInterpreter(doReview(), [
      expectPrint("# due yesterday\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now?", "1"),
      expectPrint("# not due yet\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now?", "2"),
    ])
  })
})
