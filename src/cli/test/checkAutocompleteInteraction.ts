import { DistinctQuestion } from "inquirer"
import { TestCliAutocomplete } from "./testCliInterpreter"

export type AutocompleteQuestion = DistinctQuestion<any> & {
  source: (_: any, input: string) => Promise<string[]>
  suggestOnly?: boolean
}

export async function checkAutocompleteInteraction(
  question: AutocompleteQuestion,
  expected: TestCliAutocomplete,
) {
  expect([
    question.type,
    question.message,
    question.suggestOnly,
    // Include this to make debugging easier
    expected.response,
  ]).toEqual([
    "autocomplete",
    expected.message,
    expected.suggestOnly,
    expected.response,
  ])

  await checkAutocompletions(question.source, expected.expectedAutocompletions)
  await checkResponseInSource(question.source, expected)
}

async function checkAutocompletions(
  source: (_: any, input: string) => Promise<string[]>,
  expectedAutocompletions: { [input: string]: string[] },
) {
  for (const entry of Object.entries(expectedAutocompletions)) {
    const [input, completions] = entry
    const actual = await source({}, input)
    expect(actual).toEqual(completions)
  }
}

async function checkResponseInSource(
  source: (_: any, input: string) => Promise<string[]>,
  expected: TestCliAutocomplete,
) {
  if (expected.responseMustAlreadyExist) {
    const options = await source({}, expected.response)
    expect(options).toContain(expected.response)
  }
}
