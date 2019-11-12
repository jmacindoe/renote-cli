import { BaseNote } from "../../base/model/BaseNote"
import { DbBaseNote, deserializeBaseNote } from "../../base/db/BaseNoteDb"
import { assert } from "../../../../error/assert"
import * as t from "io-ts"
import { decodeOrThrow } from "../../../../error/decode"

export const textNoteType = "TextNote"

export interface TextNote extends BaseNote {
  type: typeof textNoteType
  title: string
  body: string
}

const TextNoteTypeData = t.type({
  title: t.string,
  body: t.string,
})

export function serializeTextNoteTypeData(title: string, body: string): string {
  return JSON.stringify({
    title,
    body,
  })
}

export function deserializeDbTextNote(doc: DbBaseNote): TextNote {
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
}
