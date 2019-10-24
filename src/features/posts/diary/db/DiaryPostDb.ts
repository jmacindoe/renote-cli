import mongoose, { Document } from "mongoose"
import {
  BasePostDb,
  DbBasePost,
  deserializeBasePost,
} from "../../base/db/BasePostDb"
import { DiaryPost } from "../model/DiaryPost"
import { diaryPostPlugin } from "../diaryPostPlugin"
import { assert } from "../../../../error/assert"

export const diaryNoteId = "DiaryPost"

export interface DbDiaryPost extends DbBasePost {
  prompt: string
}

export const DiaryPostDb = BasePostDb.discriminator<DiaryPost & Document>(
  diaryNoteId,
  new mongoose.Schema({
    prompt: String,
  }),
)

export function deserializeDbDiaryPost(doc: DbDiaryPost): DiaryPost {
  assert(doc.__t === diaryNoteId)
  const { _id, createdAt, nextDue } = deserializeBasePost(doc)
  return {
    type: "diary",
    _id,
    prompt: doc.prompt,
    createdAt,
    nextDue,
  }
}
