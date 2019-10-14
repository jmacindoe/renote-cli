import mongoose, { Document } from "mongoose"
import { BasePost } from "../model/BasePost"

export const postDiscriminatorOptions = { discriminatorKey: "type" }

export const BasePostDb = mongoose.model<BasePost & Document>(
  "Post",
  new mongoose.Schema({
    createdAt: String,
    /// Days since Jan 1 2000
    nextDue: Number,
  }),
)
