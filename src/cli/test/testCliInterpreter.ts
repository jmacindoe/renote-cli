import { DistinctQuestion } from "inquirer"
import { assertDefined } from "../../error/assert"
import { CliComponent } from "../model/CliComponent"
import { CliPrint } from "../model/CliPrint"
import { ExhaustiveSwitchError } from "../../error/ExhaustiveSwitchError"

export type TestCliInteraction = TestCliPrint | TestCliPrompt

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
  response: string
}

export interface TestCliPrint {
  type: "print"
  text: string
}

export async function testCliInterpreter(
  sut: CliComponent,
  interaction: TestCliInteraction[],
  next?: any,
) {
  const request = await sut.next(next)
  if (request.done) {
    if (interaction.length !== 0) {
      throw new Error(
        "sut is done but expected further interaction: " +
          JSON.stringify(interaction),
      )
    }
  } else {
    switch (request.value.type) {
      case "print":
        const top = assertDefined(
          interaction[0],
          "Expected no further interaction but got: " +
            JSON.stringify(request.value),
        ) as CliPrint
        expect(top).toEqual({
          type: "print",
          text: request.value.text,
        })
        await testCliInterpreter(sut, interaction.slice(1))
        break
      case "prompt":
        const next = checkQuestions(request.value.questions, interaction)
        await testCliInterpreter(
          sut,
          interaction.slice(request.value.questions.length),
          next,
        )
        return
      default:
        throw new ExhaustiveSwitchError(request.value)
    }
  }
}

function checkQuestions(
  questions: ReadonlyArray<DistinctQuestion<any>>,
  interaction: TestCliInteraction[],
): any {
  if (questions.length === 0) {
    return {}
  }
  const actual = questions[0]
  const expected = assertDefined(
    interaction[0],
    "Expected no further interaction but got: " + JSON.stringify(actual),
  )
  if (expected.type !== "prompt") {
    const json = JSON.stringify(expected)
    throw new Error(`Got a question (${actual.message}) but expected ${json}`)
  }
  expectQuestionToMatch(actual, expected)
  return Object.assign(
    {},
    {
      // @ts-ignore
      [actual.name]: expected.response,
    },
    checkQuestions(questions.slice(1), interaction.slice(1)),
  )
}

function expectQuestionToMatch(
  question: DistinctQuestion<any>,
  expected: TestCliPrompt,
) {
  switch (expected.kind) {
    case "input":
      expect(question.type).toEqual("input")
      expect(question.message).toEqual(expected.question)
      break
    case "editor":
      expect(question.type).toEqual("editor")
      expect(question.message).toEqual(expected.question)
      break
    case "list":
      expect(question.type).toEqual("list")
      // @ts-ignore: type of question is not inferred to be a list
      expect(question.choices).toContain(expected.response)
      break
    default:
      throw new ExhaustiveSwitchError(expected)
  }
}
