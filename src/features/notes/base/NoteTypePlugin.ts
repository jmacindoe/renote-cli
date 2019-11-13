import { CliComponent } from "../../../cli/model/CliComponent"
import { Note } from "./model/Note"
import { Document } from "mongoose"

export interface NoteTypePlugin {
  type: string
  uiName: string
  createNote(): CliComponent
  reviewNote(note: Note): CliComponent
  deserialize(doc: Document): Note
  searchText(...fields: any[]): string
}
