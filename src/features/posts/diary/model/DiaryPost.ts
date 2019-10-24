import { BasePost } from "../../base/model/BasePost"
import { diaryNoteType } from "../db/DiaryPostDb"

export interface DiaryPost extends BasePost {
  type: typeof diaryNoteType
  prompt: string
}
