import { DistinctQuestion, ListQuestion } from "inquirer"
import { assertDefined } from "../../error/assert"
import { CliComponent } from "../model/CliComponent"
import { ExhaustiveSwitchError } from "../../error/ExhaustiveSwitchError"
import { NameValue } from "../model/CliPrompt"

export type TestCliInteraction =
  | TestCliPrint
  | TestCliPrompt
  | AnyFurtherInteraction

type TestCliPrompt = TestCliInput | TestCliEditor | TestCliList

export interface TestCliInput {
  type: "prompt"
  kind: "input"
  question: string
  response: string
}

export interface TestCliEditor {
  type: "prompt"
  kind: "editor"
  question: string
  response: string
}

export interface TestCliList {
  type: "prompt"
  kind: "list"
  choice: string
  options: string[] | null
}

export interface TestCliPrint {
  type: "print"
  text: string
}

export interface AnyFurtherInteraction {
  type: "any-further-interaction"
}

export async function testCliInterpreter<TReturn = any>(
  sut: CliComponent<TReturn>,
  interaction: TestCliInteraction[],
  next?: any,
): Promise<TReturn> {
  const request = await sut.next(next)
  if (request.done) {
    if (interaction.length !== 0) {
      throw new Error(
        "sut is done but expected further interaction: " +
          JSON.stringify(interaction),
      )
    } else {
      return request.value
    }
  } else {
    if (interaction[0] && interaction[0].type === "any-further-interaction") {
      // @ts-ignore: We can't know the return value since we skip the end of the interaction. Presumably we don't care about it.
      return undefined
    }

    const expected = assertDefined(
      interaction[0],
      "Expected no further interaction but got: " +
        JSON.stringify(request.value),
    )

    if (expected.type !== request.value.type) {
      const json = JSON.stringify(expected)
      throw new Error(`Got a ${request.value.type} but expected ${json}`)
    }

    switch (request.value.type) {
      case "print":
        expect(request.value).toEqual(expected)
        return await testCliInterpreter(sut, interaction.slice(1))
      case "prompt":
        const newNext = checkQuestion(
          request.value.question,
          expected as TestCliPrompt,
        )
        return await testCliInterpreter(sut, interaction.slice(1), newNext)
      default:
        throw new ExhaustiveSwitchError(request.value)
    }
  }
}

function checkQuestion(
  question: DistinctQuestion<any>,
  expected: TestCliPrompt,
): any {
  switch (expected.kind) {
    case "input":
      expect(question.type).toEqual("input")
      expect(question.message).toEqual(expected.question)
      return expected.response
    case "editor":
      expect(question.type).toEqual("editor")
      expect(question.message).toEqual(expected.question)
      return expected.response
    case "list":
      expect(question.type).toEqual("list")
      return checkListQuestion(question as ListQuestion, expected)
    default:
      throw new ExhaustiveSwitchError(expected)
  }
}

function checkListQuestion(question: ListQuestion, expected: TestCliList) {
  // @ts-ignore: our type is a simplification of the real type
  const rawChoices: ReadonlyArray<NameValue<any> | string> = question.choices
  const choices = rawChoices.map(asNameValue)
  checkListOptionsMatch(choices.map(c => c.name), expected.options)
  const match = choices.find(c => c.name === expected.choice)
  if (match) {
    return match.value
  } else {
    throw new Error(
      `Expected choice (${expected.choice}) not in list: ` +
        JSON.stringify(rawChoices),
    )
  }
}

function asNameValue(choice: string | NameValue<any>): NameValue<any> {
  if (typeof choice === "string") {
    return {
      name: choice,
      value: choice,
    }
  }
  return choice
}

function checkListOptionsMatch(actual: string[], expected: string[] | null) {
  if (!expected) {
    return // We explicitly don't care about checking this
  }
  expect(actual).toEqual(expected)
}
