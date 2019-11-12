import { DueData } from "./DueData"

export interface BaseNote {
  _id: any
  createdAt: Date
  due: DueData
}
