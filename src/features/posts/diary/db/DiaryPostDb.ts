import mongoose, { Document } from "mongoose"
import { BasePostDb, postDiscriminatorOptions } from "../../base/db/BasePostDb"
import { DiaryPost } from "../model/DiaryPost"

export const DiaryPostDb = BasePostDb.discriminator<DiaryPost & Document>(
  "DiaryPost",
  new mongoose.Schema(
    {
      title: String,
      body: String,
    },
    postDiscriminatorOptions,
  ),
)
