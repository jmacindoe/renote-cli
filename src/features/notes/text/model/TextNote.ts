import { BaseNote } from "../../base/model/BaseNote"

export const textNoteType = "TextNote"

export interface TextNote extends BaseNote {
  type: typeof textNoteType
  title: string
  body: string
}
