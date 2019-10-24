import { Post } from "../base/model/Post"
import { PostTypePlugin } from "../base/PostTypePlugin"
import { createTextNoteCli } from "./cli/createTextNote.cli"
import { CliComponent } from "../../../cli/model/CliComponent"
import { deserializeDbTextPost, textNoteType } from "./db/TextPostDb"

export const textPostPlugin: PostTypePlugin = {
  type: textNoteType,
  uiName: "Text",
  createNote: createTextNoteCli,
  reviewNote(post: Post): CliComponent {
    throw new Error("TODO")
  },
  deserialize: deserializeDbTextPost,
}
