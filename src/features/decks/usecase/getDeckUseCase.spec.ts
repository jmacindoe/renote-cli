import { TestBackendDb } from "../../../db/TestBackendDb"
import { getDeckUseCase } from "./getDeckUseCase"
import { TestDsl } from "../../../test/dsl/TestDsl"
import { ObjectId } from "mongodb"
import { Id } from "../../../db/Id"

const db = new TestBackendDb()

beforeAll(async () => {
  await db.init()
})

afterAll(async () => {
  await db.tearDown()
})

afterEach(async () => {
  await db.deleteAllData()
})

describe("getDeckUseCase", () => {
  it("returns a deck given its id", async () => {
    const deck = await TestDsl.given.aDeck("the-deck")

    const actual = await getDeckUseCase(deck._id)
    expect(actual._id).toEqual(deck._id)
    expect(actual.name).toEqual("the-deck")
  })

  it("errors if no matching deck exists", async () => {
    const promise = getDeckUseCase(new ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"))
    await expect(promise).rejects.toMatchInlineSnapshot(
      `[Error: No such deck: aaaaaaaaaaaaaaaaaaaaaaaa]`,
    )
  })
})
