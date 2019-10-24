import { CliComponent } from "../../../cli/model/CliComponent"
import { Post } from "./model/Post"
import { Document } from "mongoose"

export interface PostTypePlugin {
  id: string
  name: string
  createNote(): CliComponent
  reviewNote(post: Post): CliComponent
  deserialize(doc: Document): Post
}
