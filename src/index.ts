import yargs from "yargs"
import { BackendDb } from "./db/BackendDb"
import { ExhaustiveSwitchError } from "./error/ExhaustiveSwitchError"
import { addNote } from "./features/notes/add"
import { doReview } from "./features/notes/review"
import { CliComponent } from "./cli/model/CliComponent"
import { cliInterpreter } from "./cli/cliInterpreter"

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

  function commandUi(command: RenoteCommand): CliComponent {
    switch (command) {
      case "add":
        return addNote()
      case "review":
        return doReview()
      default:
        throw new ExhaustiveSwitchError(command)
    }
  }

  const command = readCliArguments(process.argv)
  await cliInterpreter(commandUi(command))
  tearDown()
}

function init() {
  BackendDb.init("mongodb://localhost:27017/renote")
}

function tearDown() {
  BackendDb.tearDown()
}

main()
