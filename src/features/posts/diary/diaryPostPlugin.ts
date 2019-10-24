import { Post } from "../base/model/Post"
import { PostTypePlugin } from "../base/PostTypePlugin"
import { createDiaryPost } from "./cli/createDiaryPost.cli"
import { CliComponent } from "../../../cli/model/CliComponent"
import { deserializeDbDiaryPost } from "./db/DiaryPostDb"

export const diaryPostPlugin: PostTypePlugin = {
  id: "DiaryPost",
  name: "Diary",
  createNote: createDiaryPost,
  reviewNote(post: Post): CliComponent {
    throw new Error("TODO")
  },
  deserialize: deserializeDbDiaryPost,
}
