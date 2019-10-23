import inquirer from "inquirer"
import { CliComponent } from "./model/CliComponent"
import { CliOperation } from "./model/CliOperation"
import { ExhaustiveSwitchError } from "../error/ExhaustiveSwitchError"

export async function cliInterpreter(cli: () => CliComponent) {
  const component = cli()
  var next: any | undefined = undefined
  var request: IteratorResult<CliOperation>
  do {
    request = await component.next(next)
    if (request.value) {
      next = await execute(request.value)
    }
  } while (!request.done)
}

async function execute(request: CliOperation): Promise<any | undefined> {
  switch (request.type) {
    case "print":
      console.log(request.text)
      return undefined
    case "prompt":
      return await inquirer.prompt(request.questions)
    default:
      throw new ExhaustiveSwitchError(request)
  }
}
