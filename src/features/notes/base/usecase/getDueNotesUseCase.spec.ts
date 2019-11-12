import { TestBackendDb } from "../../../../db/TestBackendDb"
import { createTextNoteUseCase } from "../../text/usecase/createTextNoteUseCase"
import { LocalDate } from "../model/LocalDate"
import { createDiaryNoteUseCase } from "../../diary/usecase/createDiaryNoteUseCase"
import { getDueNotesUseCase } from "./getDueNotesUseCase"

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

describe("getDueNotesUseCase", () => {
  it("gets due notes", async () => {
    const today = new LocalDate(1000)
    await createTextNoteUseCase("title", "body", {
      nextDue: new LocalDate(1000),
      algorithm: "alg",
      algorithmData: "whatever",
    })
    await createDiaryNoteUseCase("prompt", {
      nextDue: new LocalDate(999),
      algorithm: "alg",
      algorithmData: "something",
    })
    const notes = await getDueNotesUseCase(today)
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
        "due": Object {
          "algorithm": "alg",
          "algorithmData": "whatever",
          "nextDue": LocalDate {
            "daysSince2000": 1000,
          },
        },
        "title": "title",
        "type": "TextNote",
      }
    `,
    )
    expect(notes[1]).toMatchInlineSnapshot(
      customMatchers,
      `
      Object {
        "_id": Anything,
        "createdAt": Any<Date>,
        "due": Object {
          "algorithm": "alg",
          "algorithmData": "something",
          "nextDue": LocalDate {
            "daysSince2000": 999,
          },
        },
        "prompt": "prompt",
        "type": "DiaryNote",
      }
    `,
    )
  })

  it("doesn't get notes not yet due", async () => {
    const today = new LocalDate(1000)
    await createTextNoteUseCase("title", "body", {
      nextDue: new LocalDate(1001),
      algorithm: "alg",
      algorithmData: "whatever",
    })
    const notes = await getDueNotesUseCase(today)
    expect(notes).toHaveLength(0)
  })
})
