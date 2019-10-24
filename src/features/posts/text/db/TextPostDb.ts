import mongoose from "mongoose"
import {
  BasePostDb,
  DbBasePost,
  deserializeBasePost,
} from "../../base/db/BasePostDb"
import { TextPost } from "../model/TextPost"
import { assert } from "../../../../error/assert"

export const textNoteType = "TextNote"

export interface DbTextPost extends DbBasePost {
  title: string
  body: string
}

export const TextPostDb = BasePostDb.discriminator<DbTextPost>(
  textNoteType,
  new mongoose.Schema({
    title: String,
    body: String,
  }),
)

export function deserializeDbTextPost(doc: DbTextPost): TextPost {
  assert(doc.__t === textNoteType)
  const { _id, createdAt, nextDue } = deserializeBasePost(doc)
  return {
    type: textNoteType,
    _id,
    title: doc.title,
    body: doc.body,
    createdAt,
    nextDue,
  }
}
