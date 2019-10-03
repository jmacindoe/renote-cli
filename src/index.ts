import yargs from "yargs"
import { RenoteDb } from "./db"
import { ExhaustiveSwitchError } from "./ExhaustiveSwitchError"
import { addNote } from "./operations/add"
import { doReview } from "./operations/review"

export type RenoteCommand = "add" | "review"

async function main() {
  const db = await RenoteDb.create()

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
        await addNote(db)
        break
      case "review":
        await doReview(db)
        break
      default:
        throw new ExhaustiveSwitchError(command)
    }
  }

  const command = readCliArguments(process.argv)
  await runCommand(command)
  db.close()
}

main()
