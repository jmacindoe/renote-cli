import { NoteTypePlugin } from "../base/NoteTypePlugin"
import { createDiaryNote } from "./cli/createDiaryNote.cli"
import { deserializeDbDiaryNote, diaryNoteType } from "./db/DiaryNoteDb"
import { reviewDiaryNote } from "./cli/reviewDiaryNote.cli"

export const diaryNotePlugin: NoteTypePlugin = {
  type: diaryNoteType,
  uiName: "Diary",
  createNote: createDiaryNote,
  reviewNote: reviewDiaryNote,
  deserialize: deserializeDbDiaryNote,
}
