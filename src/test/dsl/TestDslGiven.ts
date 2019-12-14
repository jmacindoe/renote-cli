import { TestDsl } from "./TestDsl"

export const TestDslGiven = {
  async aDiaryNote(prompt: string, dueInNDays: number) {
    await TestDsl.interaction(
      TestDsl.mainMenu.addNote(),
      TestDsl.addNote.diary(),
      TestDsl.expectEditor("Diary prompt", prompt),
      TestDsl.addNote.showIn(dueInNDays),
    )
  },
}
