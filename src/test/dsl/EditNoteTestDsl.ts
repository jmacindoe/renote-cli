import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const menuOptions = ["Edit content", "Change deck", "Reschedule"]

export const EditNoteTestDsl = {
  menu: {
    content(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Edit content")
    },

    deck(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Change deck")
    },

    reschedule(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Reschedule")
    },
  },
}
