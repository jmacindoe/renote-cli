import { PostTypePlugin } from "../base/PostTypePlugin"
import { createDiaryPost } from "./cli/createDiaryPost.cli"
import { deserializeDbDiaryPost, diaryNoteType } from "./db/DiaryPostDb"
import { reviewDiaryNote } from "./cli/reviewDiaryNote.cli"

export const diaryPostPlugin: PostTypePlugin = {
  type: diaryNoteType,
  uiName: "Diary",
  createNote: createDiaryPost,
  reviewNote: reviewDiaryNote,
  deserialize: deserializeDbDiaryPost,
}
