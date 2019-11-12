import { NoteTypePlugin } from "../base/NoteTypePlugin"
import { createTextNoteCli } from "./cli/createTextNote.cli"
import { reviewTextNoteCli } from "./cli/reviewTextNote.cli"
import { textNoteType, deserializeDbTextNote } from "./model/TextNote"

export const textNotePlugin: NoteTypePlugin = {
  type: textNoteType,
  uiName: "Text",
  createNote: createTextNoteCli,
  reviewNote: reviewTextNoteCli,
  deserialize: deserializeDbTextNote,
}
