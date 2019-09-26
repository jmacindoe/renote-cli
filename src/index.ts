import yargs from "yargs"
import { RenoteDb } from "./db"
import { ExhaustiveSwitchError } from "./ExhaustiveSwitchError"

export type RenoteCommand = "add" | "dump"

async function main() {
  const db = await RenoteDb.create()

  function readCliArguments(argv: string[]): RenoteCommand {
    const command = yargs.argv._[0]
    if (command === "add" || command === "dump") {
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
      case "dump":
        await dumpDb()
        break
      default:
        throw new ExhaustiveSwitchError(command)
    }
  }

  async function addNote() {
    await db.createPost("title", "body")
  }

  async function dumpDb() {
    console.log(await db.dumpDb())
  }

  const command = readCliArguments(process.argv)
  await runCommand(command)
  db.close()
}

main()
