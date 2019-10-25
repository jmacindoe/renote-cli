import { BaseNote } from "../../base/model/BaseNote"
import { diaryNoteType } from "../db/DiaryNoteDb"

export interface DiaryNote extends BaseNote {
  type: typeof diaryNoteType
  prompt: string
}
