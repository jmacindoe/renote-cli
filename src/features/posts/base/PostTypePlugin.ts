import { Post } from "./model/Post"
import { CliComponent } from "../../../cli/model/CliComponent"

export interface PostTypePlugin {
  name: string
  createNote(): CliComponent
  // Returns true if review was performed (ie can handle the post type)
  reviewNote(post: Post): Promise<boolean>
}
