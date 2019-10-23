import { CliComponent } from "../../../../cli/model/CliComponent"
import { promptForBody } from "../../base/cli/promptForBody"
import { promptForNextDue } from "../../base/cli/promptForNextDue"
import { promptForTitle } from "../../base/cli/promptForTitle"
import { createDiaryPostUseCase } from "../usecase/createDiaryPostUseCase"

export async function* createDiaryPost(): CliComponent {
  const title = yield* promptForTitle()
  const body = yield* promptForBody()
  const nextDue = yield* promptForNextDue()
  await createDiaryPostUseCase(title, body, nextDue)
}
