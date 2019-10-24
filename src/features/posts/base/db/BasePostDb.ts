import mongoose from "mongoose"
import { DocumentWithDiscriminator } from "../../../../db/DocumentWithDiscriminator"
import { BasePost } from "../model/BasePost"
import { LocalDate } from "../model/LocalDate"

export type DbBasePost = DocumentWithDiscriminator & {
  _id: any
  createdAt: string
  nextDue: number
}

export const BasePostDb = mongoose.model<DbBasePost>(
  "Post",
  new mongoose.Schema({
    createdAt: String,
    /// Days since Jan 1 2000
    nextDue: Number,
  }),
)

export function deserializeBasePost(doc: DbBasePost): BasePost {
  return {
    _id: doc._id,
    createdAt: new Date(doc.createdAt),
    nextDue: new LocalDate(doc.nextDue),
  }
}
