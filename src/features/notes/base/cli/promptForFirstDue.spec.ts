import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { expectInput } from "../../../../cli/test/expectInput"
import { MockTime } from "../../../../test/MockTime"
import { LocalDate } from "../model/LocalDate"
import { expectPrint } from "../../../../cli/test/expectPrint"
import { TestDsl } from "../../../../test/dsl/TestDsl"
import { anyFurtherInteraction } from "../../../../cli/test/anyFurtherInteraction"
import { promptForFirstDue } from "./promptForFirstDue"

beforeEach(() => {
  MockTime.install()
})

afterEach(async () => {
  MockTime.reset()
})

describe("promptForFirstDue", () => {
  it("gives standard due prompt", async () => {
    const actual = await testCliInterpreter(promptForFirstDue(), [
      expectInput("Show in how many days from now?", "3"),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "3",
        "nextDue": LocalDate {
          "daysSince2000": 3003,
        },
      }
    `)
  })

  it("rejects empty input", async () => {
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
          "daysSince2000": 3003,
        },
      }
    `)
  })

  it("reprompts on non-integer input", async () => {
    const actual = await testCliInterpreter(promptForFirstDue(), [
      expectInput("Show in how many days from now?", "foo"),
      expectInput("Show in how many days from now?", "3"),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "3",
        "nextDue": LocalDate {
          "daysSince2000": 3003,
        },
      }
    `)
  })
})
