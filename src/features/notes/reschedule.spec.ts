import { TestBackendDb } from "../../db/TestBackendDb"
import { TestDsl } from "../../test/dsl/TestDsl"
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

describe("reschedule", () => {
  it("reschedules a note", async () => {
    await TestDsl.given.aTextNote("doc 1", 3)

    await TestDsl.interaction(
      TestDsl.mainMenu.reschedule(),
      TestDsl.expectInput("Note search", "1"),
      TestDsl.expectPrint("\nFound 1 results\n"),
      TestDsl.expectList(["New search", "doc 1"], "doc 1"),
      TestDsl.expectPrint("Note is due in 3 days. Shows every 3 days."),
      TestDsl.reviewNote.reschedule.nextShow(2),
      TestDsl.reviewNote.reschedule.thenEvery({ previous: 3, new: 5 }),
    )

    MockTime.tickDays(1)
    await TestDsl.expect.noNotesDueToday()
    MockTime.tickDays(1)
    await TestDsl.expect.notesDueToday([
      {
        text: "doc 1",
        previousDue: 5,
        showInResponse: "",
      },
    ])
  })
})
