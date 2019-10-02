import inquirer from "inquirer"
import { Post, RenoteDb } from "../db"
import { nextDueFromString, showInHowManyDays } from "../prompts/whenDue"

export async function doReview(db: RenoteDb) {
  const posts = await db.getTodaysPosts()
  if (posts.length === 0) {
    console.log("Nothing due today")
  } else {
    reviewPosts(db, posts)
  }
}

async function reviewPosts(db: RenoteDb, posts: Post[]) {
  for (const post of posts) {
    const nextDue = await reviewPost(post)
    await db.updateDueDate(post._id, nextDue)
  }
}

async function reviewPost(post: Post): Promise<Date> {
  console.log("# " + post.title + "\n")
  console.log(post.body)

  const answers = await inquirer.prompt([showInHowManyDays])
  return nextDueFromString(answers.nextDueInNDays)
}
