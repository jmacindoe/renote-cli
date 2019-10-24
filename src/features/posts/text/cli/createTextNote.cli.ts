import { CliComponent } from "../../../../cli/model/CliComponent"
import { promptForNextDue } from "../../base/cli/promptForNextDue"
import { createTextPostUseCase } from "../usecase/createTextPostUseCase"
import { inputPrompt, editorPrompt } from "../../../../cli/model/CliPrompt"

export async function* createTextNoteCli(): CliComponent {
  const title = yield* inputPrompt("Title")
  const body = yield* editorPrompt("Body")
  const nextDue = yield* promptForNextDue()
  await createTextPostUseCase(title, body, nextDue)
}
