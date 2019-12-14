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

  showIn(nDays: number): TestCliInteraction {
    return TestDsl.expectInput(
      "Show in how many days from now?",
      nDays.toString(),
    )
  },
}
