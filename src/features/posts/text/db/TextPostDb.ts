import mongoose from "mongoose"
import {
  BasePostDb,
  DbBasePost,
  deserializeBasePost,
} from "../../base/db/BasePostDb"
import { TextPost } from "../model/TextPost"
import { assert } from "../../../../error/assert"
import { textPostPlugin } from "../textPostPlugin"

export interface DbTextPost extends DbBasePost {
  title: string
  body: string
}

export const TextPostDb = BasePostDb.discriminator<DbTextPost>(
  "TextPost",
  new mongoose.Schema({
    title: String,
    body: String,
  }),
)

export function deserializeDbTextPost(doc: DbTextPost): TextPost {
  assert(doc.__t === textPostPlugin.id)
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
