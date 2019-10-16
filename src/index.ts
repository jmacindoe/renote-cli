import yargs from "yargs"
import { BackendDb } from "./db/BackendDb"
import { ExhaustiveSwitchError } from "./error/ExhaustiveSwitchError"
import { addNote } from "./features/posts/add"
import { doReview } from "./features/posts/review"

export type RenoteCommand = "add" | "review"

async function main() {
  init()

  function readCliArguments(argv: string[]): RenoteCommand {
    const command = yargs.argv._[0]
    if (command === "add" || command === "review") {
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
      default:
        throw new ExhaustiveSwitchError(command)
    }
  }

  const command = readCliArguments(process.argv)
  await runCommand(command)
  tearDown()
}

function init() {
  BackendDb.init("mongodb://localhost:27017/renote")
}

function tearDown() {
  BackendDb.tearDown()
}

main()
