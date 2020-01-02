import { CliComponent } from "../../cli/model/CliComponent"
import { listPrompt } from "../../cli/model/CliPrompt"
import { doReview } from "./review"
import { addNote } from "./add"
import { search } from "./search"
import { editNote } from "./edit"
import { rescheduleNote } from "./reschedule"

export async function* mainMenu(): CliComponent {
  const command = yield* listPrompt([
    "Review",
    "Add",
    "Edit",
    "Reschedule",
    "Search",
  ])
  switch (command) {
    case "Review":
      yield* doReview()
      break
    case "Add":
      yield* addNote()
      break
    case "Edit":
      yield* editNote()
      break
    case "Reschedule":
      yield* rescheduleNote()
      break
    case "Search":
      yield* search()
      break
    default:
      throw new Error("Unknown command: " + command)
  }
}
