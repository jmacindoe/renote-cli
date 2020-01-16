import {
  testCliInterpreter,
  TestCliInteraction,
} from "../../../../../cli/test/testCliInterpreter"
import { promptForDeck, promptForExistingDeck } from "./promptForDeck"
import { TestDsl } from "../../../../../test/dsl/TestDsl"
import { TestBackendDb } from "../../../../../db/TestBackendDb"

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

describe("promptForDeck", () => {
  // TODO: test input with quotation marks/special characters in it (should be banned?)

  it("selects existing deck", async () => {
    await TestDsl.given.aTextNote("note", 1, "the-deck")

    const actual = await testCliInterpreter(promptForDeck(), [
      selectDeck("the-deck"),
    ])
    expect(actual).toEqual("the-deck")
  })

  it("creates a new deck", async () => {
    await TestDsl.given.aTextNote("note", 1, "the-deck")

    const actual = await testCliInterpreter(promptForDeck(), [
      selectDeck("new-deck"),
      TestDsl.expectConfirm(`Create new deck "new-deck"`, true),
      TestDsl.expectPrint(`Created deck "new-deck"`),
    ])
    expect(actual).toEqual("new-deck")
  })

  it("repromts if user selects to not create a new deck", async () => {
    await TestDsl.given.aTextNote("note", 1, "the-deck")

    const actual = await testCliInterpreter(promptForDeck(), [
      selectDeck("new-deck"),
      TestDsl.expectConfirm(`Create new deck "new-deck"`, false),
      TestDsl.expectPrint(`Did not create deck`),
      selectDeck("the-deck"),
    ])
    expect(actual).toEqual("the-deck")
  })

  describe("promptForExistingDeck", () => {
    it("only allows existing decks (suggestOnly == false)", async () => {
      await TestDsl.given.aTextNote("note", 1, "the-deck")

      const actual = await testCliInterpreter(promptForExistingDeck(), [
        TestDsl.expectAutocomplete("Deck", "the-deck", { suggestOnly: false }),
      ])
      expect(actual).toEqual("the-deck")
    })
  })
})

function selectDeck(deck: string): TestCliInteraction {
  return TestDsl.expectAutocomplete("Deck", deck, { suggestOnly: true })
}
