import { createTextNoteCli } from "./cli/createTextNote.cli"
import { reviewTextNoteCli } from "./cli/reviewTextNote.cli"
import { textNoteType, TextNote } from "./model/TextNote"
import * as t from "io-ts"
import { DbNote, deserializeBaseNote } from "../base/db/NoteDb"
import { assert } from "../../../error/assert"
import { decodeOrThrow } from "../../../error/decode"
import { editTextNoteCli } from "./cli/editTextNote.cli"

const TextNoteTypeData = t.type({
  body: t.string,
})

export const textNotePlugin = {
  type: textNoteType,
  uiName: "Text",
  createNote: createTextNoteCli,
  editNote: editTextNoteCli,
  reviewNote: reviewTextNoteCli,
  serializeTypeData(body: string): string {
    return JSON.stringify({
      body,
    })
  },
  deserialize(doc: DbNote): TextNote {
    assert(doc.type === textNoteType)
    const { _id, createdAt, due } = deserializeBaseNote(doc)
    const { body } = decodeOrThrow(TextNoteTypeData, doc.typeData)
    return {
      type: textNoteType,
      _id,
      body,
      createdAt,
      due,
    }
  },
  searchText(body: string): string {
    return body
  },
  asText(note: TextNote): string {
    return note.body
  },
  asShortText(note: TextNote): string {
    return note.body.replace(/\n/g, " ").slice(0, 200)
  },
}
