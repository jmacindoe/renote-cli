import { CliComponent } from "../../../../cli/model/CliComponent"
import { promptForNextDue } from "../../base/cli/promptForNextDue"
import { createDiaryPostUseCase } from "../usecase/createDiaryPostUseCase"
import { inputPrompt } from "../../../../cli/model/CliPrompt"

export async function* createDiaryPost(): CliComponent {
  const prompt = yield* inputPrompt("Diary prompt")
  const nextDue = yield* promptForNextDue()
  await createDiaryPostUseCase(prompt, nextDue)
}
