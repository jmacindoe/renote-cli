import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const allOptions = ["Review", "Add", "Edit", "Search"]

export const MainMenuTestDsl = {
  review(): TestCliInteraction {
    return TestDsl.expectList(allOptions, "Review")
  },

  addNote(): TestCliInteraction {
    return TestDsl.expectList(allOptions, "Add")
  },

  editNote(): TestCliInteraction {
    return TestDsl.expectList(allOptions, "Edit")
  },

  search(): TestCliInteraction {
    return TestDsl.expectList(allOptions, "Search")
  },
}
