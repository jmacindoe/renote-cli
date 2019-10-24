import mongoose from "mongoose"
import {
  BasePostDb,
  DbBasePost,
  deserializeBasePost,
} from "../../base/db/BasePostDb"
import { TextPost } from "../model/TextPost"
import { assert } from "../../../../error/assert"

export const textNoteId = "TextPost"

export interface DbTextPost extends DbBasePost {
  title: string
  body: string
}

export const TextPostDb = BasePostDb.discriminator<DbTextPost>(
  textNoteId,
  new mongoose.Schema({
    title: String,
    body: String,
  }),
)

export function deserializeDbTextPost(doc: DbTextPost): TextPost {
  assert(doc.__t === textNoteId)
  const { _id, createdAt, nextDue } = deserializeBasePost(doc)
  return {
    type: "text",
    _id,
    title: doc.title,
    body: doc.body,
    createdAt,
    nextDue,
  }
}
