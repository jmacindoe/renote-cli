import { TestBackendDb } from "../../../../db/TestBackendDb"
import { createTextNoteUseCase } from "../../text/usecase/createTextNoteUseCase"
import { LocalDate } from "../model/LocalDate"
import { createDiaryNoteUseCase } from "../../diary/usecase/createDiaryNoteUseCase"
import { getDueNotesUseCase } from "./getDueNotesUseCase"
import { MockTime } from "../../../../test/MockTime"
import { TestDsl } from "../../../../test/dsl/TestDsl"

const db = new TestBackendDb()

beforeAll(async () => {
  await db.init()
})

beforeEach(() => {
  MockTime.install()
})

afterAll(async () => {
  await db.tearDown()
})

afterEach(async () => {
  await db.deleteAllData()
  MockTime.reset()
})

describe("getDueNotesUseCase", () => {
  it("gets due notes", async () => {
    await TestDsl.given.aTextNote("body", 0, "deck1")
    await TestDsl.given.aDiaryNote("prompt", 1, "deck2")
    MockTime.tickDays(1)

    const notes = await getDueNotesUseCase(MockTime.today())
    expect(notes).toHaveLength(2)
    const customMatchers = {
      _id: expect.anything(),
      deckId: expect.anything(),
      createdAt: expect.any(Date),
    }
    expect(notes[0]).toMatchInlineSnapshot(
      customMatchers,
      `
      Object {
        "_id": Anything,
        "body": "body",
        "createdAt": Any<MockDate>,
        "deckId": Anything,
        "due": Object {
          "algorithm": "NDays",
          "algorithmData": "0",
          "nextDue": LocalDate {
            "daysSince2000": 3000,
          },
        },
        "type": "TextNote",
      }
    `,
    )
    expect(notes[1]).toMatchInlineSnapshot(
      customMatchers,
      `
      Object {
        "_id": Anything,
        "createdAt": Any<MockDate>,
        "deckId": Anything,
        "due": Object {
          "algorithm": "NDays",
          "algorithmData": "1",
          "nextDue": LocalDate {
            "daysSince2000": 3001,
          },
        },
        "prompt": "prompt",
        "type": "DiaryNote",
      }
    `,
    )
  })

  it("doesn't get notes not yet due", async () => {
    await TestDsl.given.aTextNote("body", 1, "deck1")

    const notes = await getDueNotesUseCase(MockTime.today())
    expect(notes).toHaveLength(0)
  })
})
