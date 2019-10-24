import { LocalDate } from "../model/LocalDate"
import { Post } from "../model/Post"
import { BasePostDb } from "../db/BasePostDb"
import { noteTypePlugins } from "../../postTypePlugins"

export async function getDuePostsUseCase(
  dueOn: LocalDate = new LocalDate(),
): Promise<Post[]> {
  const docs = await BasePostDb.find({
    nextDue: { $lte: dueOn.daysSince1Jan2000() },
  }).exec()
  return noteTypePlugins.deserializeAll(docs)
}
