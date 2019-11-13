import inquirer from "inquirer"
import { ExhaustiveSwitchError } from "../error/ExhaustiveSwitchError"
import { CliComponent } from "./model/CliComponent"

export async function cliInterpreter(component: CliComponent) {
  await interpreter(component)
}

async function interpreter(sut: CliComponent, next?: any) {
  const request = await sut.next(next)
  if (request.done) {
    return
  }

  const operation = request.value
  switch (operation.type) {
    case "print":
      // tslint:disable-next-line: no-console
      console.log(operation.text)
      await interpreter(sut)
      break
    case "prompt":
      const newNext = await inquirer.prompt(operation.questions)
      await interpreter(sut, newNext)
      break
    default:
      throw new ExhaustiveSwitchError(operation)
  }
}
