import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { promptForNextDue } from "./promptForNextDue"
import { expectInput } from "../../../../cli/test/expectInput"
import { MockTime } from "../../../../test/MockTime"
import { LocalDate } from "../model/LocalDate"
import { expectPrint } from "../../../../cli/test/expectPrint"
import { TestDsl } from "../../../../test/dsl/TestDsl"
import { anyFurtherInteraction } from "../../../../cli/test/anyFurtherInteraction"
import { promptForRescheduledDueData } from "./promptForRescheduledDueDate"

beforeEach(() => {
  MockTime.install()
})

afterEach(async () => {
  MockTime.reset()
})

describe("promptForRescheduledDueData", () => {
  const previous = {
    algorithm: "NDays",
    algorithmData: "5",
    nextDue: new LocalDate(3000),
  }

  it("repeats question when asking for next due on invalid input", async () => {
    const actual = await testCliInterpreter(
      promptForRescheduledDueData(previous),
      [
        expectInput("Next show in how many days?", "m"),
        expectInput("Next show in how many days?", ""),
        expectInput("Next show in how many days?", "3"),
        expectInput("Then show every n days: [5]", "4"),
      ],
    )

    expect(actual).toMatchInlineSnapshot(`
        Object {
          "algorithm": "NDays",
          "algorithmData": "4",
          "nextDue": LocalDate {
            "daysSince2000": 3003,
          },
        }
      `)
  })

  it("repeats question when asking for subsequent repetition rate on invalid input", async () => {
    const actual = await testCliInterpreter(
      promptForRescheduledDueData(previous),
      [
        expectInput("Next show in how many days?", "2"),
        expectInput("Then show every n days: [5]", "m"),
        expectInput("Then show every n days: [5]", "6"),
      ],
    )

    expect(actual).toMatchInlineSnapshot(`
        Object {
          "algorithm": "NDays",
          "algorithmData": "6",
          "nextDue": LocalDate {
            "daysSince2000": 3002,
          },
        }
      `)
  })
})
