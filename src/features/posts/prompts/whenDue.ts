import { LocalDate } from "../base/model/LocalDate"

export const showInHowManyDays = {
  type: "input" as "input",
  name: "nextDueInNDays" as "nextDueInNDays",
  message: "Show in how many days from now?",
}

export function nextDueFromString(nextDueInNDays: string): LocalDate {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return new LocalDate().addDays(nextDueInt)
}
