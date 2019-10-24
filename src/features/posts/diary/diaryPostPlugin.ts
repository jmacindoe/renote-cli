import { Post } from "../base/model/Post"
import { PostTypePlugin } from "../base/PostTypePlugin"
import { createDiaryPost } from "./cli/createDiaryPost.cli"
import { CliComponent } from "../../../cli/model/CliComponent"
import { deserializeDbDiaryPost, diaryNoteType } from "./db/DiaryPostDb"

export const diaryPostPlugin: PostTypePlugin = {
  type: diaryNoteType,
  uiName: "Diary",
  createNote: createDiaryPost,
  reviewNote(post: Post): CliComponent {
    throw new Error("TODO")
  },
  deserialize: deserializeDbDiaryPost,
}
