import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

export const TestDslGiven = {
  async aTextNote(
    body: string,
    dueInNDays: number,
    deck: string = "default-deck",
    deckAlreadyExists?: "deck-already-exists",
  ) {
    await TestDsl.interaction(
      TestDsl.mainMenu.addNote(),
      TestDsl.addNote.text(),
      TestDsl.expectEditor("Body", body),
      ...deckInteraction(deck, deckAlreadyExists),
      TestDsl.addNote.showIn(dueInNDays),
    )
  },

  async aDiaryNote(
    prompt: string,
    dueInNDays: number,
    deck: string = "default-deck",
    deckAlreadyExists?: "deck-already-exists",
  ) {
    await TestDsl.interaction(
      TestDsl.mainMenu.addNote(),
      TestDsl.addNote.diary(),
      TestDsl.expectEditor("Diary prompt", prompt),
      ...deckInteraction(deck, deckAlreadyExists),
      TestDsl.addNote.showIn(dueInNDays),
    )
  },
}

function deckInteraction(
  deck: string = "default-deck",
  deckAlreadyExists?: "deck-already-exists",
): TestCliInteraction[] {
  return deckAlreadyExists
    ? [TestDsl.addNote.existingDeck(deck)]
    : TestDsl.addNote.newDeck(deck)
}
