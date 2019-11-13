import { BaseNote } from "../../base/model/BaseNote"

export const diaryNoteType = "DiaryNote"

export interface DiaryNote extends BaseNote {
  type: typeof diaryNoteType
  prompt: string
}
