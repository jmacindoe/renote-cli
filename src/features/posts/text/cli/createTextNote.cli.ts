import { CliComponent } from "../../../../cli/model/CliComponent"
import { promptForBody } from "../../base/cli/promptForBody"
import { promptForNextDue } from "../../base/cli/promptForNextDue"
import { promptForTitle } from "../../base/cli/promptForTitle"
import { createTextPostUseCase } from "../usecase/createTextPostUseCase"

export async function* createTextNoteCli(): CliComponent {
  const title = yield* promptForTitle()
  const body = yield* promptForBody()
  const nextDue = yield* promptForNextDue()
  await createTextPostUseCase(title, body, nextDue)
}
