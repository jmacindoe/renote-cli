import { TestBackendDb } from "../../../db/TestBackendDb"
import { MockTime } from "../../../test/MockTime"
import { TestDsl } from "../../../test/dsl/TestDsl"

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

describe("diary e2e", () => {
  it("creates and reviews a note", async () => {
    await TestDsl.given.aDiaryNote("What is up?", 3)

    MockTime.tickDays(3)

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.expectPrint("\nDue today: 1\n"),
      TestDsl.expectPrint("What is up?"),
      TestDsl.expectEditor("Entry", "The sky"),
      TestDsl.expectInput("Show in how many days from now? [3]", "1"),
    )
  })
})
