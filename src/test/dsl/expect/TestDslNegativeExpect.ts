import { TestDslExpect } from "./TestDslExpect"
import { testCliInterpreter } from "../../../cli/test/testCliInterpreter"
import { search } from "../../../features/notes/search"
import { expectInput } from "../../../cli/test/expectInput"
import { expectPrint } from "../../../cli/test/expectPrint"

export class TestDslNegativeExpect extends TestDslExpect {
  constructor() {
    super(true)
  }

  public async diaryNoteExists(prompt: string) {
    await testCliInterpreter(search(), [
      expectInput("Query", prompt),
      expectPrint("No results"),
    ])
  }
}
