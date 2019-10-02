import yargs from "yargs"
import { RenoteDb } from "./db"
import { ExhaustiveSwitchError } from "./ExhaustiveSwitchError"
import { addNote } from "./operations/add"
import { doReview } from "./operations/review"

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
        await addNote(db)
        break
      case "review":
        await doReview(db)
        break
      case "dump":
        await dumpDb()
        break
      default:
        throw new ExhaustiveSwitchError(command)
    }
  }

  async function dumpDb() {
    console.log(await db.dumpDb())
  }

  const command = readCliArguments(process.argv)
  await runCommand(command)
  db.close()
}

main()
