import { DueData } from "../../base/model/DueData"
import { diaryNoteType } from "../model/DiaryNote"
import { createNoteUseCase } from "../../base/usecase/createNoteUseCase"
import { diaryNotePlugin } from "../diaryNotePlugin"
import { Deck } from "../../../decks/model/Deck"

export async function createDiaryNoteUseCase(
  prompt: string,
  deck: Deck,
  due: DueData,
): Promise<void> {
  const typeData = diaryNotePlugin.serializeTypeData(prompt)
  const searchText = diaryNotePlugin.searchText(prompt)
  return createNoteUseCase(diaryNoteType, typeData, deck, searchText, due)
}
