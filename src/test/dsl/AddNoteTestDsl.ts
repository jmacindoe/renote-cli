import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const noteTypeOptions = ["Text", "Diary"]
const createNewDeckOption = "[Create New Deck]"

export const AddNoteTestDsl = {
  diary(): TestCliInteraction {
    return TestDsl.expectList(noteTypeOptions, "Diary")
  },

  text(): TestCliInteraction {
    return TestDsl.expectList(noteTypeOptions, "Text")
  },

  newDeck(allDecks: string[] | null, newDeck: string): TestCliInteraction[] {
    const options =
      allDecks === null ? null : [...allDecks, createNewDeckOption]
    return [
      TestDsl.expectList(options, createNewDeckOption, { message: "Deck" }),
      TestDsl.expectInput("Deck name", newDeck),
      TestDsl.expectConfirm(`Create new deck "${newDeck}"`, true),
      TestDsl.expectPrint(`Created deck "${newDeck}"`),
    ]
  },

  existingDeck(allDecks: string[] | null, choice: string): TestCliInteraction {
    const options =
      allDecks === null ? null : [...allDecks, createNewDeckOption]
    return TestDsl.expectList(options, choice, {
      message: "Deck",
    })
  },

  showIn(nDays: number): TestCliInteraction {
    return TestDsl.expectInput(
      "Show in how many days from now?",
      nDays.toString(),
    )
  },
}
