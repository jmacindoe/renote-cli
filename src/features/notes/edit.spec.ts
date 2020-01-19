import { TestBackendDb } from "../../db/TestBackendDb"
import { TestDsl } from "../../test/dsl/TestDsl"
import { MockTime } from "../../test/MockTime"

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

describe("edit", () => {
  it("allows for a new search query", async () => {
    await TestDsl.interaction(
      TestDsl.mainMenu.editNote(),
      TestDsl.expectInput("Note search", "anything"),
      TestDsl.expectPrint("\nFound 0 results\n"),
      TestDsl.expectList(["New search"], "New search"),
      TestDsl.expectInput("Note search", "anything"),
      TestDsl.expectPrint("\nFound 0 results\n"),
      TestDsl.expectList(["New search"], "New search"),
      TestDsl.anyFurtherInteraction(),
    )
  })

  it("edits a text note", async () => {
    await TestDsl.given.aTextNote("doc 1", 3)

    await TestDsl.interaction(
      TestDsl.mainMenu.editNote(),
      TestDsl.expectInput("Note search", "1"),
      TestDsl.expectPrint("\nFound 1 results\n"),
      TestDsl.expectList(["New search", "doc 1"], "doc 1"),
      TestDsl.editNote.menu.content(),
      TestDsl.expectEditor("Body", "doc 2"),
    )

    await TestDsl.expect.not.textNoteExists("doc 1")
    await TestDsl.expect.textNoteExists("doc 2")
  })

  it("edits a diary note", async () => {
    await TestDsl.given.aDiaryNote("Q", 1)

    await TestDsl.interaction(
      TestDsl.mainMenu.editNote(),
      TestDsl.expectInput("Note search", "Q"),
      TestDsl.expectPrint("\nFound 1 results\n"),
      TestDsl.expectList(["New search", "Q"], "Q"),
      TestDsl.editNote.menu.content(),
      TestDsl.expectEditor("Diary prompt", "new"),
    )

    await TestDsl.expect.not.diaryNoteExists("Q")
    await TestDsl.expect.diaryNoteExists("new")
  })

  it("changes a note's deck", async () => {
    await TestDsl.given.aTextNote("doc 1", 3, "original deck")

    await TestDsl.interaction(
      TestDsl.mainMenu.editNote(),
      TestDsl.expectInput("Note search", "1"),
      TestDsl.expectPrint("\nFound 1 results\n"),
      TestDsl.expectList(["New search", "doc 1"], "doc 1"),
      TestDsl.editNote.menu.deck(),
      TestDsl.expectPrint("Current deck: original deck"),
      TestDsl.deck.chooseToCreateNewDeck(["original deck"], "new-deck"),
    )

    await TestDsl.expect.textNoteIsInDeck("doc 1", "new-deck")
  })

  it("reschedules a note", async () => {
    await TestDsl.given.aTextNote("doc 1", 3)

    await TestDsl.interaction(
      TestDsl.mainMenu.editNote(),
      TestDsl.expectInput("Note search", "1"),
      TestDsl.expectPrint("\nFound 1 results\n"),
      TestDsl.expectList(["New search", "doc 1"], "doc 1"),
      TestDsl.editNote.menu.reschedule(),
      TestDsl.expectPrint("Note is due in 3 days. Shows every 3 days."),
      TestDsl.reviewNote.reschedule.nextShow(2),
      TestDsl.reviewNote.reschedule.thenEvery({ previous: 3, new: 5 }),
    )

    MockTime.tickDays(1)
    await TestDsl.expect.noNotesDueToday()
    MockTime.tickDays(1)
    await TestDsl.expect.notesDueToday([
      {
        text: "doc 1",
        previousDue: 5,
        showInResponse: "",
      },
    ])
  })
})
