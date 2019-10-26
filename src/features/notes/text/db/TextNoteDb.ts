import mongoose from "mongoose"
import {
  BaseNoteDb,
  DbBaseNote,
  deserializeBaseNote,
} from "../../base/db/BaseNoteDb"
import { TextNote } from "../model/TextNote"
import { assert } from "../../../../error/assert"

export const textNoteType = "TextNote"

export interface DbTextNote extends DbBaseNote {
  title: string
  body: string
}

export const TextNoteDb = BaseNoteDb.discriminator<DbTextNote>(
  textNoteType,
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  }),
)

export function deserializeDbTextNote(doc: DbTextNote): TextNote {
  assert(doc.__t === textNoteType)
  const { _id, createdAt, nextDue } = deserializeBaseNote(doc)
  return {
    type: textNoteType,
    _id,
    title: doc.title,
    body: doc.body,
    createdAt,
    nextDue,
  }
}
