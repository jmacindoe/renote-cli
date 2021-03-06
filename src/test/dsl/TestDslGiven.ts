import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"
import { Deck } from "../../features/decks/model/Deck"
import { createDeckUseCase } from "../../features/decks/usecase/createDeckUseCase"

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

  async aDeck(name: string): Promise<Deck> {
    return await createDeckUseCase(name)
  },
}

function deckInteraction(
  deck: string = "default-deck",
  deckAlreadyExists?: "deck-already-exists",
): TestCliInteraction[] {
  return deckAlreadyExists
    ? [TestDsl.deck.chooseExistingDeck(null, deck)]
    : TestDsl.deck.chooseToCreateNewDeck(null, deck)
}
