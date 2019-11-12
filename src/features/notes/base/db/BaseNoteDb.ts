import mongoose from "mongoose"
import { DocumentWithDiscriminator } from "../../../../db/DocumentWithDiscriminator"
import { BaseNote } from "../model/BaseNote"
import { LocalDate } from "../model/LocalDate"

export type DbBaseNote = DocumentWithDiscriminator & {
  _id: any
  createdAt: string
  /// Days since Jan 1 2000
  nextDue: number
  dueAlgorithm: string
  /// Any data required to calculate the next due date
  dueAlgorithmData: string
}

export const BaseNoteDb = mongoose.model<DbBaseNote>(
  "Note",
  new mongoose.Schema({
    createdAt: {
      type: String,
      required: true,
    },
    nextDue: {
      type: Number,
      required: true,
    },
    dueAlgorithm: {
      type: String,
      required: true,
    },
    dueAlgorithmData: {
      type: String,
      required: true,
    },
  }),
)

export function deserializeBaseNote(doc: DbBaseNote): BaseNote {
  return {
    _id: doc._id,
    createdAt: new Date(doc.createdAt),
    due: {
      nextDue: new LocalDate(doc.nextDue),
      algorithm: doc.dueAlgorithm,
      algorithmData: doc.dueAlgorithmData,
    },
  }
}
