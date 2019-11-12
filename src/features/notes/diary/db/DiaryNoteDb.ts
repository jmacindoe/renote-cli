import mongoose, { Document } from "mongoose"
import {
  BaseNoteDb,
  DbBaseNote,
  deserializeBaseNote,
} from "../../base/db/BaseNoteDb"
import { DiaryNote } from "../model/DiaryNote"
import { assert } from "../../../../error/assert"

export const diaryNoteType = "DiaryNote" as "DiaryNote"

export interface DbDiaryNote extends DbBaseNote {
  prompt: string
}

export const DiaryNoteDb = BaseNoteDb.discriminator<DbDiaryNote & Document>(
  diaryNoteType,
  new mongoose.Schema({
    prompt: {
      type: String,
      required: true,
    },
  }),
)

export function deserializeDbDiaryNote(doc: DbDiaryNote): DiaryNote {
  assert(doc.__t === diaryNoteType)
  const { _id, createdAt, due } = deserializeBaseNote(doc)
  return {
    type: diaryNoteType,
    _id,
    prompt: doc.prompt,
    createdAt,
    due,
  }
}
