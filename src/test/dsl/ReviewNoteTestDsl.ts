import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const menuOptions = ["Edit", "Delete"]

export const ReviewNoteTestDsl = {
  noneDue(): TestCliInteraction {
    return TestDsl.expectPrint("Nothing due today")
  },

  dueToday(nDue: number): TestCliInteraction {
    return TestDsl.expectPrint(`\nDue today: ${nDue}\n`)
  },

  showIn(due: { previous: number; new: number | "m" }): TestCliInteraction {
    return TestDsl.expectInput(
      `Show in how many days from now? [${due.previous}]`,
      due.new.toString(),
    )
  },

  menu: {
    edit(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Edit")
    },

    delete(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Delete")
    },
  },
}
