import { TestDslExpect } from "./TestDslExpect"
import { TestDslNegativeExpect } from "./TestDslNegativeExpect"
import { testCliInterpreter } from "../../../cli/test/testCliInterpreter"
import { search } from "../../../features/notes/search"
import { expectInput } from "../../../cli/test/expectInput"
import { expectPrint } from "../../../cli/test/expectPrint"

export class TestDslPositiveExpect extends TestDslExpect {
  public not = new TestDslNegativeExpect()

  constructor() {
    super(false)
  }

  public async diaryNoteExists(prompt: string) {
    // TODO: this does not assert it's a diary note
    await testCliInterpreter(search(), [
      expectInput("Query", prompt),
      expectPrint(prompt),
    ])
  }
}
