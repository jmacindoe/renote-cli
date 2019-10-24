import { PostTypePlugin } from "../base/PostTypePlugin"
import { createTextNoteCli } from "./cli/createTextNote.cli"
import { deserializeDbTextPost, textNoteType } from "./db/TextPostDb"
import { reviewTextNoteCli } from "./cli/reviewTextNote.cli"

export const textPostPlugin: PostTypePlugin = {
  type: textNoteType,
  uiName: "Text",
  createNote: createTextNoteCli,
  reviewNote: reviewTextNoteCli,
  deserialize: deserializeDbTextPost,
}
