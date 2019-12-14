import { TestBackendDb } from "../../db/TestBackendDb"
import { MockTime } from "../../test/MockTime"
import { TestDsl } from "../../test/dsl/TestDsl"

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
    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.expectPrint("Nothing due today"),
    )
  })

  it("reviews the due notes", async () => {
    await TestDsl.given.aTextNote("due in 1", 1)
    await TestDsl.given.aTextNote("due in 2", 2)
    await TestDsl.given.aTextNote("due in 3", 3)

    MockTime.tickDays(2)

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.expectPrint("\nDue today: 2\n"),
      TestDsl.expectPrint("due in 2"),
      TestDsl.expectInput("Show in how many days from now? [2]", "1"),
      TestDsl.expectPrint("due in 1"),
      TestDsl.expectInput("Show in how many days from now? [1]", "2"),
    )

    MockTime.tickDays(1)

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.expectPrint("\nDue today: 2\n"),
      TestDsl.expectPrint("due in 3"),
      TestDsl.expectInput("Show in how many days from now? [3]", "2"),
      TestDsl.expectPrint("due in 2"),
      TestDsl.expectInput("Show in how many days from now? [1]", "1"),
    )
  })
})
