import { TestDsl } from "../../../test/dsl/TestDsl"
import { getDecksUseCase } from "./getDecksUseCase"
import { TestBackendDb } from "../../../db/TestBackendDb"
import { Deck } from "../model/Deck"

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
    expect(namesOf(actual)).toEqual(["the-deck"])
  })

  it("performs a partial match on deck name", async () => {
    await TestDsl.given.aTextNote("note1", 1, "deck1")
    await TestDsl.given.aTextNote("note1", 1, "deck2")

    const actual = await getDecksUseCase("eck")
    expect(namesOf(actual)).toEqual(["deck1", "deck2"])
  })

  it("gets an exact match", async () => {
    await TestDsl.given.aTextNote("note1", 1, "deck1")
    await TestDsl.given.aTextNote("note1", 1, "deck2")

    const actual = await getDecksUseCase("deck1")
    expect(namesOf(actual)).toEqual(["deck1"])
  })
})

function namesOf(decks: Deck[]): string[] {
  return decks.map(deck => deck.name)
}
