import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const noteTypeOptions = ["Text", "Diary"]

export const AddNoteTestDsl = {
  diary(): TestCliInteraction {
    return TestDsl.expectList(noteTypeOptions, "Diary")
  },

  text(): TestCliInteraction {
    return TestDsl.expectList(noteTypeOptions, "Text")
  },

  newDeck(deck: string): TestCliInteraction[] {
    return [
      TestDsl.expectAutocomplete("Deck", deck, { suggestOnly: true }),
      TestDsl.expectConfirm(`Create new deck "${deck}"`, true),
      TestDsl.expectPrint(`Created deck "${deck}"`),
    ]
  },

  existingDeck(name: string): TestCliInteraction {
    return TestDsl.expectAutocomplete("Deck", name, { suggestOnly: true })
  },

  showIn(nDays: number): TestCliInteraction {
    return TestDsl.expectInput(
      "Show in how many days from now?",
      nDays.toString(),
    )
  },
}
