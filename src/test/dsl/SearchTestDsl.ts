import { TestCliInteraction } from "../../cli/test/testCliInterpreter"
import { TestDsl } from "./TestDsl"

export const SearchTestDsl = {
  noDeckFilter(): TestCliInteraction {
    return TestDsl.expectConfirm("Filter by deck", false)
  },

  deckFilter(allDecks: string[], choice: string): TestCliInteraction[] {
    return [
      TestDsl.expectConfirm("Filter by deck", true),
      TestDsl.expectList(allDecks, choice, { message: "Deck" }),
    ]
  },
}
