import { BaseNote } from "../../base/model/BaseNote"
import { DbBaseNote, deserializeBaseNote } from "../../base/db/BaseNoteDb"
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

export function deserializeDbDiaryNote(doc: DbBaseNote): DiaryNote {
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
