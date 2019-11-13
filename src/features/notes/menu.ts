import { CliComponent } from "../../cli/model/CliComponent"
import { listPrompt } from "../../cli/model/CliPrompt"
import { doReview } from "./review"
import { addNote } from "./add"
import { search } from "./search"

export async function* mainMenu(): CliComponent {
  const command = yield* listPrompt(["Review", "Add", "Search"])
  switch (command) {
    case "Review":
      yield* doReview()
      break
    case "Add":
      yield* addNote()
      break
    case "Search":
      yield* search()
      break
    default:
      throw new Error("Unknown command: " + command)
  }
}
