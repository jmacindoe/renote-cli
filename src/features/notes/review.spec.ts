import { TestBackendDb } from "../../db/TestBackendDb"
import { MockTime } from "../../test/MockTime"
import { TestDsl } from "../../test/dsl/TestDsl"

const db = new TestBackendDb()

beforeAll(async () => {
  await db.init()
})

afterAll(async () => {
  await db.tearDown()
})

beforeEach(() => {
  MockTime.install()
})

afterEach(async () => {
  await db.deleteAllData()
  MockTime.reset()
})

describe("review", () => {
  it("prints a message if there are no notes due", async () => {
    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.noneDue(),
    )
  })

  it("reviews the due notes", async () => {
    await TestDsl.given.aTextNote("due in 1", 1, "deck1")
    await TestDsl.given.aTextNote("due in 2", 2, "deck2")
    await TestDsl.given.aTextNote("due in 3", 3, "deck3")

    MockTime.tickDays(2)

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.dueToday(2),
      TestDsl.expectPrint("due in 2"),
      TestDsl.reviewNote.showIn({ previous: 2, new: 1 }),
      TestDsl.expectPrint("due in 1"),
      TestDsl.expectPrint("Note was due yesterday. Shows everyday."),
      TestDsl.reviewNote.late.scheduleRelativeToToday(),
      TestDsl.reviewNote.showIn({ previous: 1, new: 2 }),
    )

    MockTime.tickDays(1)

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.dueToday(2),
      TestDsl.expectPrint("due in 3"),
      TestDsl.reviewNote.showIn({ previous: 3, new: 2 }),
      TestDsl.expectPrint("due in 2"),
      TestDsl.reviewNote.showIn({ previous: 1, new: 1 }),
    )
  })

  it("allows a note to be deleted", async () => {
    await TestDsl.given.aTextNote("the note", 0)

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.dueToday(1),
      TestDsl.expectPrint("the note"),
      TestDsl.reviewNote.showIn({ previous: 0, new: "m" }),
      TestDsl.reviewNote.menu.delete(),
    )

    await TestDsl.expect.not.textNoteExists("the note")
  })

  it("changes a note's deck", async () => {
    await TestDsl.given.aTextNote("the note", 0, "original deck")

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.dueToday(1),
      TestDsl.expectPrint("the note"),
      TestDsl.reviewNote.showIn({ previous: 0, new: "m" }),
      TestDsl.reviewNote.menu.changeDeck(),
      TestDsl.expectPrint("Current deck: original deck"),
      TestDsl.deck.chooseToCreateNewDeck(["original deck"], "new-deck"),
      TestDsl.reviewNote.showIn({ previous: 0, new: 1 }),
    )

    await TestDsl.expect.textNoteIsInDeck("the note", "new-deck")
  })

  it("prints info about a note", async () => {
    await TestDsl.given.aTextNote("the note", 0, "the-deck")

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.dueToday(1),
      TestDsl.expectPrint("the note"),
      TestDsl.reviewNote.showIn({ previous: 0, new: "m" }),
      TestDsl.reviewNote.menu.info(),
      TestDsl.expectPrint("Deck: the-deck"),
      TestDsl.reviewNote.showIn({ previous: 0, new: 1 }),
    )
  })

  it("allows a note to be edited", async () => {
    await TestDsl.given.aTextNote("the note", 0)

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.dueToday(1),
      TestDsl.expectPrint("the note"),
      TestDsl.reviewNote.showIn({ previous: 0, new: "m" }),
      TestDsl.reviewNote.menu.edit(),
      TestDsl.expectEditor("Body", "edited"),
      TestDsl.reviewNote.showIn({ previous: 0, new: 1 }),
    )

    await TestDsl.expect.not.textNoteExists("the note")
    await TestDsl.expect.textNoteExists("edited")
  })

  it("allows a note to be rescheduled", async () => {
    await TestDsl.given.aTextNote("the note", 0)

    await TestDsl.interaction(
      TestDsl.mainMenu.review(),
      TestDsl.reviewNote.dueToday(1),
      TestDsl.expectPrint("the note"),
      TestDsl.reviewNote.showIn({ previous: 0, new: "m" }),
      TestDsl.reviewNote.menu.reschedule(),
      TestDsl.reviewNote.reschedule.nextShow(1),
      TestDsl.reviewNote.reschedule.thenEvery({ previous: 0, new: 2 }),
    )

    MockTime.tickDays(1)

    await TestDsl.expect.notesDueToday([
      {
        text: "the note",
        previousDue: 2,
        showInResponse: "",
      },
    ])

    MockTime.tickDays(1)

    await TestDsl.expect.noNotesDueToday()

    MockTime.tickDays(1)

    await TestDsl.expect.notesDueToday([
      {
        text: "the note",
        previousDue: 2,
        showInResponse: "",
      },
    ])
  })
})
