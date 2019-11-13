import { NoteTypePlugin } from "../base/NoteTypePlugin"
import { createDiaryNote } from "./cli/createDiaryNote.cli"
import { reviewDiaryNote } from "./cli/reviewDiaryNote.cli"
import { diaryNoteType, deserializeDbDiaryNote } from "./model/DiaryNote"

export const diaryNotePlugin: NoteTypePlugin = {
  type: diaryNoteType,
  uiName: "Diary",
  createNote: createDiaryNote,
  reviewNote: reviewDiaryNote,
  deserialize: deserializeDbDiaryNote,
  searchText(prompt: string): string {
    return prompt
  },
}
