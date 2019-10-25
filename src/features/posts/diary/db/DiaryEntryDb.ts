import { ObjectId } from "bson"
import mongoose, { Document } from "mongoose"
import { DiaryEntry } from "../model/DiaryEntry"

export const DiaryEntryDb = mongoose.model<DiaryEntry & Document>(
  "DiaryEntry",
  new mongoose.Schema({
    body: String,
    createdAt: String,
  }),
)
