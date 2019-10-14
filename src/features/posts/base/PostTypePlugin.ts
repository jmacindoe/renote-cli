import { Post } from "./model/Post"

export interface PostTypePlugin {
  createNote(): Promise<void>
  // Returns true if review was performed (ie can handle the post type)
  reviewNote(post: Post): Promise<boolean>
}
