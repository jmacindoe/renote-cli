import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { promptForNextDue } from "./promptForNextDue"
import { expectInput } from "../../../../cli/test/expectInput"
import { MockTime } from "../../../../test/MockTime"
import { LocalDate } from "../model/LocalDate"

beforeEach(() => {
  MockTime.install()
})

afterEach(async () => {
  MockTime.reset()
})

describe("promptForNextDue", () => {
  it("gives standard prompt when first creating a note", async () => {
    const actual = await testCliInterpreter(promptForNextDue(), [
      expectInput("Show in how many days from now?", "3"),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "3",
        "nextDue": LocalDate {
          "daysSince2000": 3656,
        },
      }
    `)
  })

  it("reuses previous nDays on empty input", async () => {
    const previous = {
      algorithm: "NDays",
      algorithmData: "5",
      nextDue: new LocalDate(3000),
    }
    const actual = await testCliInterpreter(promptForNextDue(previous), [
      expectInput("Show in how many days from now? [5]", ""),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "5",
        "nextDue": LocalDate {
          "daysSince2000": 3658,
        },
      }
    `)
  })

  it("rejects empty input when first creating a note", async () => {
    const actual = await testCliInterpreter(promptForNextDue(), [
      expectInput("Show in how many days from now?", ""),
      expectInput("Show in how many days from now?", ""),
      expectInput("Show in how many days from now?", "3"),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "3",
        "nextDue": LocalDate {
          "daysSince2000": 3656,
        },
      }
    `)
  })

  it("Uses new nDays during review", async () => {
    const previous = {
      algorithm: "NDays",
      algorithmData: "5",
      nextDue: new LocalDate(3000),
    }
    const actual = await testCliInterpreter(promptForNextDue(previous), [
      expectInput("Show in how many days from now? [5]", "7"),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "7",
        "nextDue": LocalDate {
          "daysSince2000": 3660,
        },
      }
    `)
  })

  it("Reprompts on non-integer input", async () => {
    const actual = await testCliInterpreter(promptForNextDue(), [
      expectInput("Show in how many days from now?", "foo"),
      expectInput("Show in how many days from now?", "3"),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "3",
        "nextDue": LocalDate {
          "daysSince2000": 3656,
        },
      }
    `)
  })
})
