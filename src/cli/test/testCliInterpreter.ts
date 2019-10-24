import { DistinctQuestion } from "inquirer"
import { assertDefined } from "../../error/assert"
import { CliComponent } from "../model/CliComponent"
import { CliPrint } from "../model/CliPrint"

type TestCliInteraction = TestCliQuestionResponse | TestCliPrint

export interface TestCliQuestionResponse {
  type: "question-response"
  question: string
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
  ) as TestCliQuestionResponse
  if (expected.type !== "question-response") {
    const json = JSON.stringify(expected)
    fail(`Got a question (${actual.message}) but expected ${json}`)
  }
  expect(actual.message).toEqual(expected.question)
  return Object.assign(
    {},
    {
      // @ts-ignore
      [actual.name]: expected.response,
    },
    checkQuestions(questions.slice(1), interaction.slice(1)),
  )
}
