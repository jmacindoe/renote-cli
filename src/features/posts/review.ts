import inquirer from "inquirer"
import { LocalDate } from "./base/model/LocalDate"
import { Post } from "./base/model/Post"
import { getDuePostsUseCase } from "./base/usecase/getDuePostsUseCase"
import { updateDueDateUseCase } from "./base/usecase/updateDueDateUseCase"
import { nextDueFromString, showInHowManyDays } from "./prompts/whenDue"

export async function doReview() {
  const posts = await getDuePostsUseCase()
  if (posts.length === 0) {
    console.log("Nothing due today")
  } else {
    await reviewPosts(posts)
  }
}

async function reviewPosts(posts: Post[]) {
  for (const post of posts) {
    const nextDue = await reviewPost(post)
    await updateDueDateUseCase(post._id, nextDue)
  }
}

async function reviewPost(post: Post): Promise<LocalDate> {
  //console.log("# " + post.title + "\n")
  //console.log(post.body)

  const answers = await inquirer.prompt([showInHowManyDays])
  return nextDueFromString(answers.nextDueInNDays)
}
