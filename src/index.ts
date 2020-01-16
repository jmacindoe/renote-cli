import { BackendDb } from "./db/BackendDb"
import { cliInterpreter } from "./cli/cliInterpreter"
import { mainMenu } from "./features/notes/menu"
import { addNote } from "./features/notes/add"
import { Errors } from "./error/Errors"
import { startDocker } from "./db/Docker"
import inquirer from "inquirer"

export type RenoteCommand = "add" | "review"

async function main() {
  await init()
  const ui = process.argv[2] === "add" ? addNote() : mainMenu()
  await cliInterpreter(ui)
  await tearDown()
}

async function init() {
  inquirer.registerPrompt(
    "autocomplete",
    require("inquirer-autocomplete-prompt"),
  )
  await startDocker("3696828e64d5")
  BackendDb.init("mongodb://localhost:27017/renote")
}

async function tearDown() {
  await BackendDb.tearDown()
}

main().catch(e => Errors.recordError(e))
