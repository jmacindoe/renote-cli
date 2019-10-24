import inquirer from "inquirer"
import { LocalDate } from "./base/model/LocalDate"
import { Post } from "./base/model/Post"
import { getDuePostsUseCase } from "./base/usecase/getDuePostsUseCase"
import { updateDueDateUseCase } from "./base/usecase/updateDueDateUseCase"
import { nextDueFromString, showInHowManyDays } from "./prompts/whenDue"
import { CliComponent } from "../../cli/model/CliComponent"
import { promptForNextDue } from "./base/cli/promptForNextDue"
import { noteTypePlugins } from "./postTypePlugins"

export async function* doReview(): CliComponent {
  const posts = await getDuePostsUseCase()
  if (posts.length === 0) {
    console.log("Nothing due today")
  } else {
    yield* reviewPosts(posts)
  }
}

async function* reviewPosts(posts: Post[]): CliComponent {
  for (const post of posts) {
    yield* reviewPost(post)
    const nextDue = yield* promptForNextDue()
    await updateDueDateUseCase(post._id, nextDue)
  }
}

async function* reviewPost(note: Post): CliComponent {
  const plugin = noteTypePlugins.getByType(note.type)
  yield* plugin.reviewNote(note)
}
