import { createDiaryNote } from "./cli/createDiaryNote.cli"
import { reviewDiaryNote } from "./cli/reviewDiaryNote.cli"
import { diaryNoteType, DiaryNote } from "./model/DiaryNote"
import { deserializeBaseNote, DbNote } from "../base/db/NoteDb"
import { assert } from "../../../error/assert"
import { decodeOrThrow } from "../../../error/decode"
import * as t from "io-ts"

const DiaryNoteTypeData = t.type({
  prompt: t.string,
})

export const diaryNotePlugin = {
  type: diaryNoteType,
  uiName: "Diary",
  createNote: createDiaryNote,
  reviewNote: reviewDiaryNote,
  serializeTypeData(prompt: string): string {
    return JSON.stringify({
      prompt,
    })
  },
  deserialize(doc: DbNote): DiaryNote {
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
  },
  searchText(prompt: string): string {
    return prompt
  },
}
