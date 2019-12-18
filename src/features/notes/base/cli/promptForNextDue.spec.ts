import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { promptForNextDue, promptForFirstDue } from "./promptForNextDue"
import { expectInput } from "../../../../cli/test/expectInput"
import { MockTime } from "../../../../test/MockTime"
import { LocalDate } from "../model/LocalDate"
import { CliComponent } from "../../../../cli/model/CliComponent"
import { print } from "../../../../cli/model/CliPrint"
import { expectPrint } from "../../../../cli/test/expectPrint"

beforeEach(() => {
  MockTime.install()
})

afterEach(async () => {
  MockTime.reset()
})

describe("promptForNextDue", () => {
  const previous = {
    algorithm: "NDays",
    algorithmData: "5",
    nextDue: new LocalDate(3000),
  }

  it("gives standard prompt when first creating a note", async () => {
    const actual = await testCliInterpreter(promptForFirstDue(), [
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
    const actual = await testCliInterpreter(promptForFirstDue(), [
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

  it("reprompts on non-integer input for first due", async () => {
    const actual = await testCliInterpreter(promptForFirstDue(), [
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

  it("reprompts on non-integer input when updating due date", async () => {
    const actual = await testCliInterpreter(promptForNextDue(previous), [
      expectInput("Show in how many days from now? [5]", "foo"),
      expectInput("Show in how many days from now? [5]", "3"),
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

  it("returns menu request on input 'm'", async () => {
    const actual = await testCliInterpreter(promptForNextDue(previous), [
      expectInput("Show in how many days from now? [5]", "m"),
    ])
    expect(actual).toEqual("menu-requested")
  })

  it("returns menu request on input 'm' after retry", async () => {
    const actual = await testCliInterpreter(promptForNextDue(previous), [
      expectInput("Show in how many days from now? [5]", "rubbish"),
      expectInput("Show in how many days from now? [5]", "m"),
    ])
    expect(actual).toEqual("menu-requested")
  })
})
