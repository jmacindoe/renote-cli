import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const createNewDeckOption = "[Create New Deck]"

export const DeckTestDsl = {
  chooseToCreateNewDeck(
    allDecks: string[] | null,
    deckName: string,
  ): TestCliInteraction[] {
    const options =
      allDecks === null ? null : [...allDecks, createNewDeckOption]
    return [
      TestDsl.expectList(options, createNewDeckOption, { message: "Deck" }),
      TestDsl.expectInput("Deck name", deckName),
      TestDsl.expectConfirm(`Create new deck "${deckName}"`, true),
      TestDsl.expectPrint(`Created deck "${deckName}"`),
    ]
  },

  chooseExistingDeck(
    allDecks: string[] | null,
    choice: string,
  ): TestCliInteraction {
    const options =
      allDecks === null ? null : [...allDecks, createNewDeckOption]
    return TestDsl.expectList(options, choice, {
      message: "Deck",
    })
  },
}
