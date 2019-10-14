import { LocalDate } from "./LocalDate"

export interface BasePost {
  _id: any
  createdAt: Date
  nextDue: LocalDate
}
