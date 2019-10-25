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

export const DiaryNoteDb = BaseNoteDb.discriminator<DiaryNote & Document>(
  diaryNoteType,
  new mongoose.Schema({
    prompt: String,
  }),
)

export function deserializeDbDiaryNote(doc: DbDiaryNote): DiaryNote {
  assert(doc.__t === diaryNoteType)
  const { _id, createdAt, nextDue } = deserializeBaseNote(doc)
  return {
    type: diaryNoteType,
    _id,
    prompt: doc.prompt,
    createdAt,
    nextDue,
  }
}
