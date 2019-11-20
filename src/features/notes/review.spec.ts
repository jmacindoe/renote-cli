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

describe("review", () => {
  it("prints a message if there are no notes due", async () => {
    await testCliInterpreter(doReview(), [expectPrint("Nothing due today")])
  })

  it("reviews the due notes", async () => {
    await createTextNoteUseCase("due yesterday", "body", {
      nextDue: new LocalDate(MockTime.initialMockedLocalDate - 1),
      algorithm: "NDays",
      algorithmData: "1",
    })
    await createTextNoteUseCase("due today", "body", {
      nextDue: new LocalDate(MockTime.initialMockedLocalDate),
      algorithm: "NDays",
      algorithmData: "1",
    })
    await createTextNoteUseCase("not due yet", "body", {
      nextDue: new LocalDate(MockTime.initialMockedLocalDate + 1),
      algorithm: "NDays",
      algorithmData: "1",
    })

    await testCliInterpreter(doReview(), [
      expectPrint("\nDue today: 2\n"),
      expectPrint("# due yesterday\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now? [1]", "1"),
      expectPrint("# due today\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now? [1]", "2"),
    ])

    MockTime.tickDays(1)

    await testCliInterpreter(doReview(), [
      expectPrint("\nDue today: 2\n"),
      expectPrint("# due yesterday\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now? [1]", "1"),
      expectPrint("# not due yet\n"),
      expectPrint("body"),
      expectInput("Show in how many days from now? [1]", "2"),
    ])
  })
})
