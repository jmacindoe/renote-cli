import mongoose, { Document } from "mongoose"
import {
  BasePostDb,
  DbBasePost,
  deserializeBasePost,
} from "../../base/db/BasePostDb"
import { DiaryPost } from "../model/DiaryPost"
import { assert } from "../../../../error/assert"

export const diaryNoteType = "DiaryNote" as "DiaryNote"

export interface DbDiaryPost extends DbBasePost {
  prompt: string
}

export const DiaryPostDb = BasePostDb.discriminator<DiaryPost & Document>(
  diaryNoteType,
  new mongoose.Schema({
    prompt: String,
  }),
)

export function deserializeDbDiaryPost(doc: DbDiaryPost): DiaryPost {
  assert(doc.__t === diaryNoteType)
  const { _id, createdAt, nextDue } = deserializeBasePost(doc)
  return {
    type: diaryNoteType,
    _id,
    prompt: doc.prompt,
    createdAt,
    nextDue,
  }
}
