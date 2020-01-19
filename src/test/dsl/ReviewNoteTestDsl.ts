import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const menuOptions = ["Info", "Edit", "Reschedule", "Change deck", "Delete"]

const relativeToDueDate = "Schedule relative to due date"
const relativeToToday = "Schedule relative to today"
const customReschedule = "Custom reschedule"
const menu = "Menu"

const lateMenuOptions = [
  relativeToDueDate,
  relativeToToday,
  customReschedule,
  menu,
]

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
    info(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Info")
    },

    edit(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Edit")
    },

    reschedule(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Reschedule")
    },

    changeDeck(): TestCliInteraction {
      return TestDsl.expectList(menuOptions, "Change deck")
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
      new: number | "m" | ""
    }): TestCliInteraction {
      return TestDsl.expectInput(
        `Then show every n days: [${due.previous}]`,
        due.new.toString(),
      )
    },
  },

  late: {
    scheduleRelativeToDueDate(): TestCliInteraction {
      return TestDsl.expectList(lateMenuOptions, relativeToDueDate)
    },
    scheduleRelativeToToday(): TestCliInteraction {
      return TestDsl.expectList(lateMenuOptions, relativeToToday)
    },
    customReschedule(): TestCliInteraction {
      return TestDsl.expectList(lateMenuOptions, customReschedule)
    },
    menu(): TestCliInteraction {
      return TestDsl.expectList(lateMenuOptions, menu)
    },
  },
}
