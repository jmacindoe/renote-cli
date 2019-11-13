import { BackendDb } from "./db/BackendDb"
import { cliInterpreter } from "./cli/cliInterpreter"
import { mainMenu } from "./features/notes/menu"

export type RenoteCommand = "add" | "review"

async function main() {
  init()
  await cliInterpreter(mainMenu())
  await tearDown()
}

function init() {
  BackendDb.init("mongodb://localhost:27017/renote")
}

async function tearDown() {
  await BackendDb.tearDown()
}

// tslint:disable-next-line: no-floating-promises
main()
