import { TestDsl } from "./TestDsl"

export const TestDslGiven = {
  async aTextNote(body: string, dueInNDays: number) {
    await TestDsl.interaction(
      TestDsl.mainMenu.addNote(),
      TestDsl.addNote.text(),
      TestDsl.expectEditor("Body", body),
      TestDsl.addNote.showIn(dueInNDays),
    )
  },

  async aDiaryNote(prompt: string, dueInNDays: number) {
    await TestDsl.interaction(
      TestDsl.mainMenu.addNote(),
      TestDsl.addNote.diary(),
      TestDsl.expectEditor("Diary prompt", prompt),
      TestDsl.addNote.showIn(dueInNDays),
    )
  },
}
