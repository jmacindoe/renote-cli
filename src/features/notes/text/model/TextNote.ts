import { BaseNote } from "../../base/model/BaseNote"
import { textNoteType } from "../db/TextNoteDb"

export interface TextNote extends BaseNote {
  type: typeof textNoteType
  title: string
  body: string
}
