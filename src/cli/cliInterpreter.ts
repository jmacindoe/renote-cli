import inquirer from "inquirer"
import { CliComponent } from "./model/CliComponent"
import { CliOperation } from "./model/CliOperation"
import { ExhaustiveSwitchError } from "../error/ExhaustiveSwitchError"

export async function cliInterpreter(cli: () => CliComponent) {
  const component = cli()
  var next: any | null = null
  var request: IteratorResult<CliOperation>
  do {
    request = await component.next(...(next === null ? [] : [next]))
    if (request.value) {
      next = await execute(request.value)
    }
  } while (!request.done)
}

async function execute(request: CliOperation): Promise<any | null> {
  switch (request.type) {
    case "print":
      console.log(request.text)
      break
    case "prompt":
      return await inquirer.prompt(request.questions)
    default:
      throw new ExhaustiveSwitchError(request)
  }
}
