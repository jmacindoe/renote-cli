import { CliComponent } from "../../../../cli/model/CliComponent"
import { DiaryPost } from "../model/DiaryPost"
import { print } from "../../../../cli/model/CliPrint"
import { editorPrompt } from "../../../../cli/model/CliPrompt"
import { createDiaryEntryUseCase } from "../../base/usecase/createDiaryEntryUseCase"

export async function* reviewDiaryNote(note: DiaryPost): CliComponent {
  yield* print(note.prompt)
  const entry = yield* editorPrompt("Entry")
  await createDiaryEntryUseCase(entry)
}
