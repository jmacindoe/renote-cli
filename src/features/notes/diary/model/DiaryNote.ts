import { BaseNote } from "../../base/model/BaseNote"
import { DbNote, deserializeBaseNote } from "../../base/db/NoteDb"
import { assert } from "../../../../error/assert"
import * as t from "io-ts"
import { decodeOrThrow } from "../../../../error/decode"

export const diaryNoteType = "DiaryNote"

export interface DiaryNote extends BaseNote {
  type: typeof diaryNoteType
  prompt: string
}

const DiaryNoteTypeData = t.type({
  prompt: t.string,
})

export function serializeDiaryNoteTypeData(prompt: string): string {
  return JSON.stringify({
    prompt,
  })
}

export function deserializeDbDiaryNote(doc: DbNote): DiaryNote {
  assert(doc.type === diaryNoteType)
  const { _id, createdAt, due } = deserializeBaseNote(doc)
  const { prompt } = decodeOrThrow(DiaryNoteTypeData, doc.typeData)
  return {
    type: diaryNoteType,
    _id,
    prompt,
    createdAt,
    due,
  }
}
