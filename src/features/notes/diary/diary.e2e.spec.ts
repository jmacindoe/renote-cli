import { TestBackendDb } from "../../../db/TestBackendDb"
import { testCliInterpreter } from "../../../cli/test/testCliInterpreter"
import { addNote } from "../add"
import { expectList } from "../../../cli/test/expectList"
import { expectEditor } from "../../../cli/test/expectEditor"
import { expectInput } from "../../../cli/test/expectInput"
import { MockTime } from "../../../test/MockTime"
import { expectPrint } from "../../../cli/test/expectPrint"
import { doReview } from "../review"

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
    await testCliInterpreter(addNote(), [
      expectList("Diary"),
      expectEditor("Diary prompt", "What is up?"),
      expectInput("Show in how many days from now?", "3"),
    ])

    MockTime.tickDays(3)

    await testCliInterpreter(doReview(), [
      expectPrint("Due today: 1"),
      expectPrint("What is up?"),
      expectEditor("Entry", "The sky"),
      expectInput("Show in how many days from now? [3]", "1"),
    ])
  })
})
