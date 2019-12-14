import { TestDsl } from "./TestDsl"
import { TestCliInteraction } from "../../cli/test/testCliInterpreter"

const allOptions = ["Review", "Add", "Edit", "Search"]

export const MainMenuTestDsl = {
  addNote(): TestCliInteraction {
    return TestDsl.expectList(allOptions, "Add")
  },

  editNote(): TestCliInteraction {
    return TestDsl.expectList(allOptions, "Edit")
  },
}
