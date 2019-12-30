import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const menuOptions = ["Edit", "Reschedule", "Delete"]

export const ReviewNoteTestDsl = {
  noneDue(): TestCliInteraction {
    return TestDsl.expectPrint("Nothing due today")
  },

  dueToday(nDue: number): TestCliInteraction {
    return TestDsl.expectPrint(`\nDue today: ${nDue}\n`)
  },

  showIn(due: {
    previous: number
    new: number | "m" | ""
  }): TestCliInteraction {
    return TestDsl.expectInput(
      `Show in how many days from now? [${due.previous}]`,
      due.new.toString(),
    )
  },

  menu: {
    edit(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Edit")
    },

    reschedule(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Reschedule")
    },

    delete(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Delete")
    },
  },

  reschedule: {
    nextShow(nDays: number): TestCliInteraction {
      return TestDsl.expectInput(
        `Next show in how many days?`,
        nDays.toString(),
      )
    },

    thenEvery(due: {
      previous: number
      new: number | "m"
    }): TestCliInteraction {
      return TestDsl.expectInput(
        `Then show every n days: [${due.previous}]`,
        due.new.toString(),
      )
    },
  },
}
