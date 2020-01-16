import { TestDsl } from "../../../../test/dsl/TestDsl"
import { getDecksUseCase } from "./getDecksUseCase"
import { TestBackendDb } from "../../../../db/TestBackendDb"

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

describe("getDecksUseCase", () => {
  it("returns all decks on empty query", async () => {
    await TestDsl.given.aTextNote("note 1", 1, "the-deck")

    const actual = await getDecksUseCase("")
    expect(actual).toEqual(["the-deck"])
  })

  // TODO: more
})
