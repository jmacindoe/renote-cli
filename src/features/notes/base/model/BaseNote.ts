import { DueData } from "./DueData"
import { Id } from "../../../../db/Id"

export interface BaseNote {
  _id: any
  createdAt: Date
  due: DueData
  deckId: Id
}
