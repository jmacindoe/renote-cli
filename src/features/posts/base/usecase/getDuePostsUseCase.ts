import { LocalDate } from "../model/LocalDate"
import { Post } from "../model/Post"

export async function getDuePostsUseCase(): Promise<Post[]> {
  // @ts-ignore: TODO: convert these to JS objects in a type-safe way
  return await BasePost.find({
    nextDue: { $lte: new LocalDate().daysSince1Jan2000() },
  }).exec()
}
