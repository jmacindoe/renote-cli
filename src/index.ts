import { addDays } from "date-fns"
import inquirer from "inquirer"
import yargs from "yargs"
import { RenoteDb, Post } from "./db"
import { ExhaustiveSwitchError } from "./ExhaustiveSwitchError"

export type RenoteCommand = "add" | "review" | "dump"

async function main() {
  const db = await RenoteDb.create()

  function readCliArguments(argv: string[]): RenoteCommand {
    const command = yargs.argv._[0]
    if (command === "add" || command === "review" || command === "dump") {
      return command
    } else {
      throw new Error("Unknown command line argument")
    }
  }

  async function runCommand(command: RenoteCommand) {
    switch (command) {
      case "add":
        await addNote()
        break
      case "review":
        await doReview()
        break
      case "dump":
        await dumpDb()
        break
      default:
        throw new ExhaustiveSwitchError(command)
    }
  }

  async function addNote() {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Title",
      },
      {
        type: "editor",
        name: "body",
        message: "Body",
      },
      {
        type: "input",
        name: "nextDueInNDays",
        message: "Show in how many days from now?",
      },
    ])

    // @ts-ignore - TODO: why does TS fail here?
    const { title, body, nextDueInNDays } = answers
    const nextDue = nextDueFromString(nextDueInNDays)
    await db.createPost(title, body, nextDue)
  }

  function nextDueFromString(nextDueInNDays: string): Date {
    const nextDueInt = parseInt(nextDueInNDays, 10)
    return addDays(new Date(), nextDueInt)
  }

  async function doReview() {
    const posts = await db.getTodaysPosts()
    if (posts.length === 0) {
      console.log("Nothing due today")
    } else {
      reviewPosts(posts)
    }
  }

  async function reviewPosts(posts: Post[]) {
    for (const post of posts) {
      const nextDue = await reviewPost(post)
      await db.updateDueDate(post._id, nextDue)
    }
  }

  async function reviewPost(post: Post): Promise<Date> {
    console.log("# " + post.title + "\n")
    console.log(post.body)

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "nextDueInNDays",
        message: "Show in how many days from now?",
      },
    ])
    return nextDueFromString(answers.nextDueInNDays)
  }

  async function dumpDb() {
    console.log(await db.dumpDb())
  }

  const command = readCliArguments(process.argv)
  await runCommand(command)
  db.close()
}

main()
