import { createTextNoteCli } from "./cli/createTextNote.cli"
import { reviewTextNoteCli } from "./cli/reviewTextNote.cli"
import { textNoteType, TextNote } from "./model/TextNote"
import * as t from "io-ts"
import { DbNote, deserializeBaseNote } from "../base/db/NoteDb"
import { assert } from "../../../error/assert"
import { decodeOrThrow } from "../../../error/decode"

const TextNoteTypeData = t.type({
  title: t.string,
  body: t.string,
})

export const textNotePlugin = {
  type: textNoteType,
  uiName: "Text",
  createNote: createTextNoteCli,
  reviewNote: reviewTextNoteCli,
  serializeTypeData(title: string, body: string): string {
    return JSON.stringify({
      title,
      body,
    })
  },
  deserialize(doc: DbNote): TextNote {
    assert(doc.type === textNoteType)
    const { _id, createdAt, due } = deserializeBaseNote(doc)
    const { title, body } = decodeOrThrow(TextNoteTypeData, doc.typeData)
    return {
      type: textNoteType,
      _id,
      title,
      body,
      createdAt,
      due,
    }
  },
  searchText(title: string, body: string): string {
    return title + " " + body
  },
}
