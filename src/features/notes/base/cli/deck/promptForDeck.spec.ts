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
      TestDsl.addNote.existingDeck(["the-deck"], "the-deck"),
    ])
    expect(actual.name).toEqual("the-deck")
  })

  it("creates a new deck", async () => {
    await TestDsl.given.aTextNote("note", 1, "the-deck")

    const actual = await testCliInterpreter(
      promptForDeck(),
      TestDsl.addNote.newDeck(["the-deck"], "new-deck"),
    )
    expect(actual.name).toEqual("new-deck")
  })

  it("repromts if user selects to not create a new deck", async () => {
    await TestDsl.given.aTextNote("note", 1, "the-deck")

    const actual = await testCliInterpreter(promptForDeck(), [
      TestDsl.expectList(
        ["the-deck", "[Create New Deck]"],
        "[Create New Deck]",
        { message: "Deck" },
      ),
      TestDsl.expectInput("Deck name", "new-deck"),
      TestDsl.expectConfirm(`Create new deck "new-deck"`, false),
      TestDsl.expectPrint(`Did not create deck`),
      TestDsl.addNote.existingDeck(["the-deck"], "the-deck"),
    ])
    expect(actual.name).toEqual("the-deck")
  })

  describe("promptForExistingDeck", () => {
    it("does not have option to create new deck", async () => {
      await TestDsl.given.aTextNote("note", 1, "the-deck")

      const actual = await testCliInterpreter(promptForExistingDeck(), [
        TestDsl.expectList(["the-deck"], "the-deck", { message: "Deck" }),
      ])
      expect(actual.name).toEqual("the-deck")
    })
  })
})
