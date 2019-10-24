import { BasePost } from "../../base/model/BasePost"
import { textNoteType } from "../db/TextPostDb"

export interface TextPost extends BasePost {
  type: typeof textNoteType
  title: string
  body: string
}
