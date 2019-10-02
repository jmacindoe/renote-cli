import { addDays } from "date-fns"
import { LocalDate } from "local-date"

export const showInHowManyDays = {
  type: "input" as "input",
  name: "nextDueInNDays" as "nextDueInNDays",
  message: "Show in how many days from now?",
}

export function nextDueFromString(nextDueInNDays: string): LocalDate {
  const nextDueInt = parseInt(nextDueInNDays, 10)
  return addDays(new Date(), nextDueInt)
}
