import { MainMenuTestDsl } from "./MainMenuTestDsl"
import { TestDslPositiveExpect } from "./expect/TestDslPositiveExpect"
import { mainMenu } from "../../features/notes/menu"
import {
  testCliInterpreter,
  TestCliInteraction,
} from "../../cli/test/testCliInterpreter"
import { expectList } from "../../cli/test/expectList"
import { expectInput } from "../../cli/test/expectInput"
import { expectPrint } from "../../cli/test/expectPrint"
import { expectEditor } from "../../cli/test/expectEditor"
import { expectConfirm } from "./InputTestDsl"
import { expectAutocomplete } from "./InputTestDsl"
import { AddNoteTestDsl } from "./AddNoteTestDsl"
import { TestDslGiven } from "./TestDslGiven"
import { anyFurtherInteraction } from "../../cli/test/anyFurtherInteraction"
import { ReviewNoteTestDsl } from "./ReviewNoteTestDsl"
import { SearchTestDsl } from "./SearchTestDsl"
import { EditNoteTestDsl } from "./EditNoteTestDsl"
import { DeckTestDsl } from "./DeckTestDsl"

export const TestDsl = {
  given: TestDslGiven,
  interaction,
  expect: new TestDslPositiveExpect(),

  mainMenu: MainMenuTestDsl,
  search: SearchTestDsl,
  deck: DeckTestDsl,
  addNote: AddNoteTestDsl,
  reviewNote: ReviewNoteTestDsl,
  editNote: EditNoteTestDsl,

  expectInput,
  expectPrint,
  expectList,
  expectEditor,
  expectConfirm,
  expectAutocomplete,
  anyFurtherInteraction,
}

async function interaction<TReturn>(
  ...ops: Array<TestCliInteraction | TestCliInteraction[]>
): Promise<TReturn> {
  const expectedInteraction = flatten(ops)
  return await testCliInterpreter(mainMenu(), expectedInteraction)
}

function flatten<T>(input: Array<T | T[]>): T[] {
  return input.flatMap(item => (Array.isArray(item) ? item : [item]))
}
