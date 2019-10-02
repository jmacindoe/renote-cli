import mongoose, { Document } from "mongoose"
import { LocalDate } from "./model/LocalDate"

mongoose.Promise = global.Promise

export interface Post {
  _id: any
  title: string
  body: string
  createdAt: Date
  nextDue: LocalDate
}

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  // TODO: store correct timezone in string
  createdAt: String,
  nextDue: Number,
})

const Post = mongoose.model<Post & Document>("Post", postSchema)

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
    await Post.create({
      title,
      body,
      createdAt: new Date().toISOString(),
      nextDue: nextDue.daysSince1Jan2000(),
    })
  }

  async getTodaysPosts(): Promise<Post[]> {
    return await Post.find({
      nextDue: new LocalDate().daysSince1Jan2000(),
    }).exec()
  }

  async updateDueDate(_id: any, newDueDate: LocalDate) {
    await Post.updateOne(
      { _id },
      { $set: { nextDue: newDueDate.daysSince1Jan2000() } },
    ).exec()
  }

  async dumpDb(): Promise<Post[]> {
    const docs = await Post.find().exec()
    return docs.map(doc => ({
      _id: doc._id,
      title: doc.title,
      body: doc.body,
      createdAt: doc.createdAt,
      nextDue: doc.nextDue,
    }))
  }
}
