import { expectQuestion } from "../../../../cli/test/expectQuestion"
import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { TestBackendDb } from "../../../../db/TestBackendDb"
import { BasePostDb } from "../../base/db/BasePostDb"
import { createTextPostUseCase } from "../../text/usecase/createTextPostUseCase"
import { LocalDate } from "../model/LocalDate"
import { createDiaryPostUseCase } from "../../diary/usecase/createDiaryPostUseCase"
import { getDuePostsUseCase } from "./getDuePostsUseCase"

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

describe("getDuePostsUseCase", () => {
  it("gets due posts", async () => {
    const today = new LocalDate(1000)
    await createTextPostUseCase("title", "body", new LocalDate(1000))
    await createDiaryPostUseCase("prompt", new LocalDate(999))
    const notes = await getDuePostsUseCase(today)
    expect(notes).toHaveLength(2)
    const customMatchers = {
      _id: expect.anything(),
      createdAt: expect.any(Date),
    }
    expect(notes[0]).toMatchInlineSnapshot(
      customMatchers,
      `
      Object {
        "_id": Anything,
        "body": "body",
        "createdAt": Any<Date>,
        "nextDue": LocalDate {
          "daysSince2000": 1000,
        },
        "title": "title",
        "type": "text",
      }
    `,
    )
    expect(notes[1]).toMatchInlineSnapshot(
      customMatchers,
      `
      Object {
        "_id": Anything,
        "createdAt": Any<Date>,
        "nextDue": LocalDate {
          "daysSince2000": 999,
        },
        "prompt": "prompt",
        "type": "diary",
      }
    `,
    )
  })

  it("doesn't get posts not yet due", async () => {
    const today = new LocalDate(1000)
    await createTextPostUseCase("title", "body", new LocalDate(1001))
    const notes = await getDuePostsUseCase(today)
    expect(notes).toHaveLength(0)
  })
})
