import { LocalDate } from "./LocalDate"

export interface DueData {
  nextDue: LocalDate
  algorithm: string
  algorithmData: string
}
