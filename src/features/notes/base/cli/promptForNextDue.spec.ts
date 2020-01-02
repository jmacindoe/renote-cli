import { testCliInterpreter } from "../../../../cli/test/testCliInterpreter"
import { promptForNextDue } from "./promptForNextDue"
import { expectInput } from "../../../../cli/test/expectInput"
import { MockTime } from "../../../../test/MockTime"
import { LocalDate } from "../model/LocalDate"
import { expectPrint } from "../../../../cli/test/expectPrint"
import { TestDsl } from "../../../../test/dsl/TestDsl"
import { anyFurtherInteraction } from "../../../../cli/test/anyFurtherInteraction"

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

  it("reuses previous nDays on empty input", async () => {
    const actual = await testCliInterpreter(promptForNextDue(previous), [
      expectInput("Show in how many days from now? [5]", ""),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "5",
        "nextDue": LocalDate {
          "daysSince2000": 3005,
        },
      }
    `)
  })

  it("returns user answer", async () => {
    const actual = await testCliInterpreter(promptForNextDue(previous), [
      expectInput("Show in how many days from now? [5]", "7"),
    ])
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "algorithm": "NDays",
        "algorithmData": "7",
        "nextDue": LocalDate {
          "daysSince2000": 3007,
        },
      }
    `)
  })

  it("reprompts on non-integer input", async () => {
    const actual = await testCliInterpreter(promptForNextDue(previous), [
      expectInput("Show in how many days from now? [5]", "foo"),
      expectInput("Show in how many days from now? [5]", "3"),
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

  describe("late review", () => {
    const dueYesterday = {
      algorithm: "NDays",
      algorithmData: "1",
      nextDue: new LocalDate(2999),
    }

    it("says how many days ago the note was due", async () => {
      const due3DaysAgo = {
        algorithm: "NDays",
        algorithmData: "5",
        nextDue: new LocalDate(2997),
      }
      await testCliInterpreter(promptForNextDue(due3DaysAgo), [
        expectPrint("Note was due 3 days ago. Shows every 5 days."),
        anyFurtherInteraction(),
      ])
    })

    it("says the note was due yesterday", async () => {
      await testCliInterpreter(promptForNextDue(dueYesterday), [
        expectPrint("Note was due yesterday. Shows everyday."),
        anyFurtherInteraction(),
      ])
    })

    it("can reschedule relative to the due date", async () => {
      const actual = await testCliInterpreter(promptForNextDue(dueYesterday), [
        expectPrint("Note was due yesterday. Shows everyday."),
        TestDsl.reviewNote.late.scheduleRelativeToDueDate(),
        TestDsl.reviewNote.showIn({ previous: 1, new: 5 }),
      ])
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "algorithm": "NDays",
          "algorithmData": "5",
          "nextDue": LocalDate {
            "daysSince2000": 3004,
          },
        }
      `)
    })

    it("can reschedule relative to today", async () => {
      const actual = await testCliInterpreter(promptForNextDue(dueYesterday), [
        expectPrint("Note was due yesterday. Shows everyday."),
        TestDsl.reviewNote.late.scheduleRelativeToToday(),
        TestDsl.reviewNote.showIn({ previous: 1, new: 5 }),
      ])
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "algorithm": "NDays",
          "algorithmData": "5",
          "nextDue": LocalDate {
            "daysSince2000": 3005,
          },
        }
      `)
    })

    it("can reschedule with custom values", async () => {
      const actual = await testCliInterpreter(promptForNextDue(dueYesterday), [
        expectPrint("Note was due yesterday. Shows everyday."),
        TestDsl.reviewNote.late.customReschedule(),
        TestDsl.reviewNote.reschedule.nextShow(3),
        TestDsl.reviewNote.reschedule.thenEvery({ previous: 1, new: 5 }),
      ])
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "algorithm": "NDays",
          "algorithmData": "5",
          "nextDue": LocalDate {
            "daysSince2000": 3003,
          },
        }
      `)
    })

    it("can open the review menu", async () => {
      const actual = await testCliInterpreter(promptForNextDue(dueYesterday), [
        expectPrint("Note was due yesterday. Shows everyday."),
        TestDsl.reviewNote.late.menu(),
      ])
      expect(actual).toEqual("menu-requested")
    })
  })
})
