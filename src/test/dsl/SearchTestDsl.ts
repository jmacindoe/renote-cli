import { TestCliInteraction } from "../../cli/test/testCliInterpreter"
import { TestDsl } from "./TestDsl"

export const SearchTestDsl = {
  noDeckFilter(): TestCliInteraction {
    return TestDsl.expectConfirm("Filter by deck", false)
  },

  deckFilter(deck: string,
  args?: {
    expectedAutocompletions: { [input: string]: string[] }
  }
    ): TestCliInteraction[] {
    return [
      TestDsl.expectConfirm("Filter by deck", true),
      TestDsl.expectAutocomplete("Deck", deck, { suggestOnly: false, responseMustAlreadyExist: true, expectedAutocompletions: args?.expectedAutocompletions }),
    ]
  },
}
