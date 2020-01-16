import { createDiaryNote } from "./cli/createDiaryNote.cli"
import { reviewDiaryNote } from "./cli/reviewDiaryNote.cli"
import { diaryNoteType, DiaryNote } from "./model/DiaryNote"
import { deserializeBaseNote, DbNote } from "../base/db/NoteDb"
import { assert } from "../../../error/assert"
import { decodeOrThrow } from "../../../error/decode"
import * as t from "io-ts"
import { editDiaryNote } from "./cli/editDiaryNote.cli"

const DiaryNoteTypeData = t.type({
  prompt: t.string,
})

export const diaryNotePlugin = {
  type: diaryNoteType,
  uiName: "Diary",
  createNote: createDiaryNote,
  editNote: editDiaryNote,
  reviewNote: reviewDiaryNote,
  serializeTypeData(prompt: string): string {
    return JSON.stringify({
      prompt,
    })
  },
  deserialize(doc: DbNote): DiaryNote {
    assert(doc.type === diaryNoteType)
    const { _id, createdAt, due, deck } = deserializeBaseNote(doc)
    const { prompt } = decodeOrThrow(DiaryNoteTypeData, doc.typeData)
    return {
      type: diaryNoteType,
      _id,
      deck,
      prompt,
      createdAt,
      due,
    }
  },
  searchText(prompt: string): string {
    return prompt
  },
  asText(note: DiaryNote): string {
    return note.prompt
  },
  asShortText(note: DiaryNote): string {
    return note.prompt.slice(0, 100)
  },
}
