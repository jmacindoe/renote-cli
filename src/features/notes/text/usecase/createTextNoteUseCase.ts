import { DueData } from "../../base/model/DueData"
import { textNoteType } from "../model/TextNote"
import { createNoteUseCase } from "../../base/usecase/createNoteUseCase"
import { textNotePlugin } from "../textNotePlugin"
import { Deck } from "../../../decks/model/Deck"

export async function createTextNoteUseCase(
  body: string,
  deck: Deck,
  due: DueData,
): Promise<void> {
  const typeData = textNotePlugin.serializeTypeData(body)
  const searchText = textNotePlugin.searchText(body)
  return createNoteUseCase(textNoteType, typeData, deck, searchText, due)
}
