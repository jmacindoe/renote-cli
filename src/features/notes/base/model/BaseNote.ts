import { LocalDate } from "./LocalDate"

export interface BaseNote {
  _id: any
  createdAt: Date
  nextDue: LocalDate
}
