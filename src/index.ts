import { BackendDb } from "./db/BackendDb"
import { cliInterpreter } from "./cli/cliInterpreter"
import { mainMenu } from "./features/notes/menu"
import { addNote } from "./features/notes/add"
import { Errors } from "./error/Errors"

export type RenoteCommand = "add" | "review"

async function main() {
  init()
  const ui = process.argv[2] === "add" ? addNote() : mainMenu()
  await cliInterpreter(ui)
  await tearDown()
}

function init() {
  BackendDb.init("mongodb://localhost:27017/renote")
}

async function tearDown() {
  await BackendDb.tearDown()
}

main().catch(e => Errors.recordError(e))
