import { ObjectId } from "bson"
import * as t from "io-ts"
import moment from "moment"
import mongoose, { Document } from "mongoose"
import { LocalDate } from "./model/LocalDate"

mongoose.Promise = global.Promise

interface BasePost {
  _id: any
  createdAt: Date
  nextDue: LocalDate
}

export interface TextPost extends BasePost {
  type: "text"
  title: string
  body: string
}

export interface DiaryPost extends BasePost {
  type: "diary"
  prompt: string
}

export type Post = TextPost | DiaryPost

export interface DiaryEntry {
  _id: any
  createdAt: Date
  body: string
}

const DiaryEntry = mongoose.model<DiaryEntry & Document>(
  "DiaryEntry",
  new mongoose.Schema({
    postId: ObjectId,
    createdAt: String,
    body: String,
  }),
)

const discriminatorOptions = { discriminatorKey: "type" }

const postSchema = new mongoose.Schema({
  createdAt: String,
  /// Days since Jan 1 2000
  nextDue: Number,
})

const BasePost = mongoose.model<BasePost & Document>("Post", postSchema)

const TextPost = BasePost.discriminator<TextPost & Document>(
  "TextPost",
  new mongoose.Schema(
    {
      title: String,
      body: String,
    },
    discriminatorOptions,
  ),
)

const DiaryPost = BasePost.discriminator<DiaryPost & Document>(
  "DiaryPost",
  new mongoose.Schema(
    {
      title: String,
      body: String,
    },
    discriminatorOptions,
  ),
)

export class RenoteDb {
  static async create(): Promise<RenoteDb> {
    const db = await mongoose.connect("mongodb://localhost:27017/renote", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    return new RenoteDb(db)
  }

  db: mongoose.Mongoose

  constructor(db: mongoose.Mongoose) {
    this.db = db
  }

  close() {
    mongoose.disconnect()
  }

  async createPost(
    title: string,
    body: string,
    nextDue: LocalDate,
  ): Promise<void> {
    await TextPost.create({
      title,
      body,
      createdAt: moment().format(),
      nextDue: nextDue.daysSince1Jan2000(),
    })
  }

  async getTodaysPosts(): Promise<Post[]> {
    // @ts-ignore: TODO: convert these to JS objects in a type-safe way
    return await BasePost.find({
      nextDue: { $lte: new LocalDate().daysSince1Jan2000() },
    }).exec()
  }

  async updateDueDate(_id: any, newDueDate: LocalDate) {
    await BasePost.updateOne(
      { _id },
      { $set: { nextDue: newDueDate.daysSince1Jan2000() } },
    ).exec()
  }
}
