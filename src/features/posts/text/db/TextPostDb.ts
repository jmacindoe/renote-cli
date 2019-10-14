import mongoose, { Document } from "mongoose"
import { BasePostDb, postDiscriminatorOptions } from "../../base/db/BasePostDb"
import { TextPost } from "../model/TextPost"

export const TextPostDb = BasePostDb.discriminator<TextPost & Document>(
  "TextPost",
  new mongoose.Schema(
    {
      title: String,
      body: String,
    },
    postDiscriminatorOptions,
  ),
)
