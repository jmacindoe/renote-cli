import { endOfToday, startOfToday } from "date-fns"
import mongoose, { Document } from "mongoose"

export interface Post {
  _id: any
  title: string
  body: string
  createdAt: Date
  nextDue: Date
}

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  createdAt: Date,
  nextDue: Date,
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

  async createPost(title: string, body: string, nextDue: Date): Promise<void> {
    await Post.create({
      title,
      body,
      createdAt: new Date(),
      nextDue,
    })
  }

  async getTodaysPosts(): Promise<Post[]> {
    return await Post.find({
      nextDue: { $gt: startOfToday(), $lt: endOfToday() },
    }).exec()
  }

  async updateDueDate(_id: any, newDueDate: Date) {
    await Post.updateOne({ _id }, { $set: { nextDue: newDueDate } }).exec()
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
