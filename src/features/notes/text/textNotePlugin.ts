import { NoteTypePlugin } from "../base/NoteTypePlugin"
import { createTextNoteCli } from "./cli/createTextNote.cli"
import { deserializeDbTextNote, textNoteType } from "./db/TextNoteDb"
import { reviewTextNoteCli } from "./cli/reviewTextNote.cli"

export const textNotePlugin: NoteTypePlugin = {
  type: textNoteType,
  uiName: "Text",
  createNote: createTextNoteCli,
  reviewNote: reviewTextNoteCli,
  deserialize: deserializeDbTextNote,
}
