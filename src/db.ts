import mongoose, { Document } from "mongoose"

export interface Post {
  title: string
  body: string
}

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
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

  async createPost(title: string, body: string): Promise<void> {
    await Post.create({
      title: title,
      body: body,
    })
  }

  async dumpDb(): Promise<Post[]> {
    const docs = await Post.find().exec()
    return docs.map(doc => ({
      title: doc.title,
      body: doc.body,
    }))
  }
}
